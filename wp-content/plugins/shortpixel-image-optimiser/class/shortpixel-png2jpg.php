<?php
/**
 * User: simon
 * Date: 17.11.2017
 * Time: 13:44
 */

//TODO decouple from directly using WP metadata, in order to be able to use it for custom images
class ShortPixelPng2Jpg {
    private $_settings = null;

    public function __construct($settings){
        if(function_exists('wp_raise_memory_limit')) {
            wp_raise_memory_limit( 'image' );
        }
        $this->_settings = $settings;
    }

    protected function canConvertPng2Jpg($image) {
        $transparent = 0;
        $transparent_pixel = $img = $bg = false;

        if (!file_exists($image) || ord(file_get_contents($image, false, null, 25, 1)) & 4) {
            $transparent = 1;
        } else {
            $contents = file_get_contents($image);
            if (stripos($contents, 'PLTE') !== false && stripos($contents, 'tRNS') !== false) {
                $transparent = 1;
            }
            if (!$transparent) {
                $is = getimagesize($image);
                WPShortPixel::log("PNG2JPG Image width: " . $is[0] . " height: " . $is[1] . " aprox. size: " . round($is[0]*$is[1]*5/1024/1024) . "M memory limit: " . ini_get('memory_limit') . " USED: " . memory_get_usage());
                WPShortPixel::log("PNG2JPG create from png $image");
                $img = @imagecreatefrompng($image);
                WPShortPixel::log("PNG2JPG created from png");
                if(!$img) {
                    WPShortPixel::log("PNG2JPG not a PNG");
                    $transparent = true; //it's not a PNG, can't convert it
                } else {
                    WPShortPixel::log("PNG2JPG is PNG");
                    $w = imagesx($img); // Get the width of the image
                    $h = imagesy($img); // Get the height of the image
                    WPShortPixel::log("PNG2JPG width $w height $h. Now checking pixels.");
                    //run through pixels until transparent pixel is found:
                    for ($i = 0; $i < $w; $i++) {
                        for ($j = 0; $j < $h; $j++) {
                            $rgba = imagecolorat($img, $i, $j);
                            if (($rgba & 0x7F000000) >> 24) {
                                $transparent_pixel = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        WPShortPixel::log("PNG2JPG is " . (!$transparent && !$transparent_pixel ? " not" : "") . " transparent");
        //pass on the img too, if it was already loaded from PNG, matter of performance
        return array('notTransparent' => !$transparent && !$transparent_pixel, 'img' => $img);
    }

    /**
     *
     * @param array $params
     * @param string $backupPath
     * @param string $suffixRegex for example [0-9]+x[0-9]+ - a thumbnail suffix - to add the counter of file name collisions files before that suffix (img-2-150x150.jpg).
     * @param image $img - the image if it was already created from png. It will be destroyed at the end.
     * @return string
     */

    protected function doConvertPng2Jpg($params, $backup, $suffixRegex = false, $img = false) {
        $image = $params['file'];
        WPShortPixel::log("PNG2JPG doConvert $image");
        if(!$img) {
            WPShortPixel::log("PNG2JPG doConvert create from PNG");
            $img = (file_exists($image) ? imagecreatefrompng($image) : false);
            if(!$img) {
                WPShortPixel::log("PNG2JPG doConvert image cannot be created.");
                return (object)array("params" => $params, "unlink" => false); //actually not a PNG.
            }
        }

        WPShortPixel::log("PNG2JPG doConvert img ready");
        $x = imagesx($img);
        $y = imagesy($img);
        WPShortPixel::log("PNG2JPG doConvert width $x height $y");
        $bg = imagecreatetruecolor($x, $y);
        WPShortPixel::log("PNG2JPG doConvert img created truecolor");
        if(!$bg) return (object)array("params" => $params, "unlink" => false);
        imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
        imagealphablending($bg, 1);
        imagecopy($bg, $img, 0, 0, 0, 0, $x, $y);
        imagedestroy($img);
        $newPath = preg_replace("/\.png$/i", ".jpg", $image);
        $newUrl = preg_replace("/\.png$/i", ".jpg", $params['url']);
        for ($i = 1; file_exists($newPath); $i++) {
            if($suffixRegex) {
                $newPath = preg_replace("/(" . $suffixRegex . ")\.png$/i", $i . '-$1.jpg', $image);
            }else {
                $newPath = preg_replace("/\.png$/i", "-" . $i . ".jpg", $image);
            }
        }
        if (imagejpeg($bg, $newPath, 90)) {
            WPShortPixel::log("PNG2JPG doConvert created JPEG at $newPath");
            $newSize = filesize($newPath);
            $origSize = filesize($image);
            if($newSize > $origSize * 0.95) {
                //if the image is not 5% smaller, don't bother.
                unlink($newPath);
                return (object)array("params" => $params, "unlink" => false);
            }
            //backup?
            if($backup) {
                $imageForBk = trailingslashit(dirname($image)) . ShortPixelAPI::MB_basename($newPath, '.jpg') . '.png';
                WPShortPixel::log("imageForBk should be PNG: $imageForBk");
                if($image != $imageForBk) {
                    WPShortPixel::log("PNG2JPG doConvert rename $image to $imageForBk");
                    @rename($image, $imageForBk);
                }
                if(!file_exists($imageForBk)) {
                    unlink($newPath);
                    return (object)array("params" => $params, "unlink" => false);
                }
                $image = $imageForBk;
                $ret = ShortPixelAPI::backupImage($image, array($image));
                if($ret['Status'] !== ShortPixelAPI::STATUS_SUCCESS) {
                    unlink($newPath);
                    return (object)array("params" => $params, "unlink" => false);
                }
            }
            //unlink($image);
            $params['file'] = $newPath;
            WPShortPixel::log("original_file should be PNG: $image");
            $params['original_file'] = $image;
            $params['url'] = $newUrl;
            $params['type'] = 'image/jpeg';
            $params['png_size'] = $origSize;
            $params['jpg_size'] = $newSize;
        }
        return (object)array("params" => $params, "unlink" => $image);
    }

    /**
     * Convert an uploaded image from PNG to JPG
     * @param type $params
     * @return string
     */
    public function convertPng2Jpg($params) {

        //echo("PARAMS : ");var_dump($params);
        if(!$this->_settings->png2jpg || strtolower(substr($params['file'], -4)) !== '.png') {
            return $params;
        }

        $image = $params['file'];
        WPShortPixel::log("Convert Media PNG to JPG on upload: {$image}");

        $ret = $this->canConvertPng2Jpg($image);
        if ($ret['notTransparent']) {
            $ret = $this->doConvertPng2Jpg($params, $this->_settings->backupImages, false, $ret['img']);
            if($ret->unlink) @unlink($ret->unlink);
            $paramsC = $ret->params;
            if($paramsC['type'] == 'image/jpeg') {
                // we don't have metadata, so save the information in a temporary map
                $conv = $this->_settings->convertedPng2Jpg;
                //do a cleanup first
                foreach($conv as $key => $val) {
                    if(time() - $val['timestamp'] > 3600) unset($conv[$key]);
                }
                $conv[$paramsC['file']] = array('pngFile' => $paramsC['original_file'], 'backup' => $this->_settings->backupImages,
                    'optimizationPercent' => round(100.0 * (1.00 - $paramsC['jpg_size'] / $paramsC['png_size'])),
                    'timestamp' => time());
                $this->_settings->convertedPng2Jpg = $conv;
            }
            return $paramsC;
        }
        return $params;
    }

    /**
     * convert PNG to JPEG if possible - already existing image in Media Library
     *
     * @param type $meta
     * @param type $ID
     * @return string
     */
    public function checkConvertMediaPng2Jpg($meta, $ID) {

        if(!$this->_settings->png2jpg || !isset($meta['file']) || strtolower(substr($meta['file'], -4)) !== '.png') {
            return $meta;
        }

        WPShortPixel::log("Send to processing: Convert Media PNG to JPG #{$ID} META: " . json_encode($meta));

        $image = $meta['file'];
        $imagePath = get_attached_file($ID);
        $basePath = trailingslashit(str_replace($image, "", $imagePath));
        $imageUrl = wp_get_attachment_url($ID);
        $baseUrl = self::removeUrlProtocol(trailingslashit(str_replace($image, "", $imageUrl))); //make the base url protocol agnostic if it's not already

        // set a temporary error in order to make sure user gets something if the image failed from memory limit.
        if(   isset($meta['ShortPixel']['Retries']) && $meta['ShortPixel']['Retries'] > 3
           && isset($meta['ShortPixel']['ErrCode']) && $meta['ShortPixel']['ErrCode'] == ShortPixelAPI::ERR_PNG2JPG_MEMORY) {
            WPShortPixel::log("PNG2JPG too many memory failures!");
            throw new Exception('Not enough memory to convert from PNG to JPG.', ShortPixelAPI::ERR_PNG2JPG_MEMORY);
        }
        $meta['ShortPixelImprovement'] = 'Error: <i>Not enough memory to convert from PNG to JPG.</i>';
        if(!isset($meta['ShortPixel']) || !is_array($meta['ShortPixel'])) {
            $meta['ShortPixel'] = array();
        }
        $meta['ShortPixel']['Retries'] = isset($meta['ShortPixel']['Retries']) ? $meta['ShortPixel']['Retries'] + 1 : 1;
        $meta['ShortPixel']['ErrCode'] = ShortPixelAPI::ERR_PNG2JPG_MEMORY;
        wp_update_attachment_metadata($ID, $meta);

        $retC = $this->canConvertPng2Jpg($imagePath);
        if (!$retC['notTransparent']) {
            WPShortPixel::log("PNG2JPG not a PNG");
            return $meta; //cannot convert it
        }

        WPShortPixel::log(" CONVERTING MAIN: $imagePath");
        $retMain = $this->doConvertPng2Jpg(array('file' => $imagePath, 'url' => false, 'type' => 'image/png'), $this->_settings->backupImages, false, $retC['img']);
        WPShortPixel::log(" CONVERTED MAIN: " . json_encode($retMain));
        WPShortPixel::log("PNG2JPG doConvert Main RETURNED " . json_encode($retMain));
        $ret = $retMain->params;
        $toUnlink = array();
        $toReplace = array();

        //unset the temporary error
        unset($meta['ShortPixelImprovement']);
        unset($meta['ShortPixel']['ErrCode']);
        $meta['ShortPixel']['Retries'] -= 1;
        wp_update_attachment_metadata($ID, $meta);

        if ($ret['type'] == 'image/jpeg') {
            $toUnlink[] = $retMain->unlink;
            //convert to the new URLs the urls in the existing posts.
            $baseRelPath = trailingslashit(dirname($image));
            $toReplace[self::removeUrlProtocol($imageUrl)] = $baseUrl . $baseRelPath . wp_basename($ret['file']);
            $pngSize = $ret['png_size'];
            $jpgSize = $ret['jpg_size'];
            WPShortPixel::log(" IMAGE PATH: $imagePath");
            $imagePath = isset($ret['original_file']) ? $ret['original_file'] : $imagePath;
            WPShortPixel::log(" SET IMAGE PATH: $imagePath");

            //conversion succeeded for the main image, update meta and proceed to thumbs. (It could also not succeed if the converted file is not smaller)
            $meta['file'] = str_replace($basePath, '', $ret['file']);
            $meta['type'] = 'image/jpeg';
            update_attached_file($ID, $meta['file']);
            wp_update_attachment_metadata($ID, $meta);

            $originalSizes = isset($meta['sizes']) ? $meta['sizes'] : array();
            foreach($meta['sizes'] as $size => $info) {
                $retThumb = $this->doConvertPng2Jpg(array('file' => $basePath . $baseRelPath . $info['file'], 'url' => false, 'type' => 'image/png'),
                    $this->_settings->backupImages, "[0-9]+x[0-9]+");
                $rett = $retThumb->params;

                WPShortPixel::log("PNG2JPG doConvert thumb RETURNED " . json_encode($rett));
                if ($rett['type'] == 'image/jpeg') {
                    $toUnlink[] = $retThumb->unlink;
                    WPShortPixel::log("PNG2JPG thumb is jpg");
                    $meta['sizes'][$size]['file'] = wp_basename($rett['file']);
                    $meta['sizes'][$size]['mime-type'] = 'image/jpeg';
                    $pngSize += $rett['png_size'];
                    $jpgSize += $rett['jpg_size'];
                    WPShortPixel::log("PNG2JPG total PNG size: $pngSize total JPG size: $jpgSize");
                    $originalSizes[$size]['file'] = wp_basename($rett['file'], '.jpg') . '.png';
                    WPShortPixel::log("PNG2JPG thumb original: " . $originalSizes[$size]['file']);
                    $toReplace[$baseUrl . $baseRelPath . $info['file']] = $baseUrl . $baseRelPath . wp_basename($rett['file']);
                    wp_update_attachment_metadata($ID, $meta);
                }
            }
            WPShortPixel::log("ORIGINAL SIZESSSS: " . json_encode($originalSizes));
            $meta['ShortPixelPng2Jpg'] = array('originalFile' => $imagePath, 'originalSizes' => $originalSizes, 'originalSizes2' => $originalSizes,
                'backup' => $this->_settings->backupImages,
                'optimizationPercent' => round(100.0 * (1.00 - $jpgSize / $pngSize)));
            wp_update_attachment_metadata($ID, $meta);
        }

        self::png2JpgUpdateUrls(array(), $toReplace);
        foreach($toUnlink as $unlink) {
            if($unlink) {
                WPShortPixel::log("PNG2JPG unlink $unlink");
                @unlink($unlink);
            }
        }
        WPShortPixel::log("PNG2JPG done. Return: " . json_encode($meta));

        return $meta;
    }

    /**
     * taken from Velvet Blues Update URLs plugin
     * @param $options
     * @param $oldurl
     * @param $newurl
     * @return array
     */
    public static function png2JpgUpdateUrls($options, $map){
        global $wpdb;
        WPShortPixel::log("PNG2JPG update URLS " . json_encode($map));
        $results = array();
        $queries = array(
            'content' =>		array("UPDATE $wpdb->posts SET post_content = replace(post_content, %s, %s)",  __('Content Items (Posts, Pages, Custom Post Types, Revisions)','shortpixel-image-optimiser') ),
            'excerpts' =>		array("UPDATE $wpdb->posts SET post_excerpt = replace(post_excerpt, %s, %s)", __('Excerpts','shortpixel-image-optimiser') ),
            'attachments' =>	array("UPDATE $wpdb->posts SET guid = replace(guid, %s, %s) WHERE post_type = 'attachment'",  __('Attachments','shortpixel-image-optimiser') ),
            'links' =>			array("UPDATE $wpdb->links SET link_url = replace(link_url, %s, %s)", __('Links','shortpixel-image-optimiser') ),
            'custom' =>			array("UPDATE $wpdb->postmeta SET meta_value = replace(meta_value, %s, %s)",  __('Custom Fields','shortpixel-image-optimiser') ),
            'guids' =>			array("UPDATE $wpdb->posts SET guid = replace(guid, %s, %s)",  __('GUIDs','shortpixel-image-optimiser') )
        );
        if(count($options) == 0) {
            $options = array_keys($queries);
        }
        foreach($options as $option){
            WPShortPixel::log("PNG2JPG update URLS on $option ");
            if( $option == 'custom' ){
                $n = 0;
                $row_count = $wpdb->get_var( "SELECT COUNT(*) FROM $wpdb->postmeta" );
                $page_size = 10000;
                $pages = ceil( $row_count / $page_size );

                for( $page = 0; $page < $pages; $page++ ) {
                    $start = $page * $page_size;
                    $pmquery = "SELECT * FROM $wpdb->postmeta WHERE meta_value <> '' AND meta_key <> '_wp_attachment_metadata' AND meta_key <> '_wp_attached_file' LIMIT $start, $page_size";
                    $items = $wpdb->get_results( $pmquery );
                    foreach( $items as $item ) {
                        $value = $item->meta_value;
                        if( trim($value) == '' )
                            continue;

                        $edited = (object)array('data' => $value, 'replaced' => false);
                        foreach($map as $oldurl => $newurl) {
                            if (strlen($newurl)) {
                                $editedOne = self::png2JpgUnserializeReplace($oldurl, $newurl, $edited->data);
                                $edited->data = $editedOne->data;
                                $edited->replaced = $edited->replaced || $editedOne->replaced;
                            }
                        }
                        if( $edited->replaced ){
                            $fix = $wpdb->query("UPDATE $wpdb->postmeta SET meta_value = '".$edited->data."' WHERE meta_id = ".$item->meta_id );
                            if( $fix )
                                $n++;
                        }
                    }
                }
                $results[$option] = array($n, $queries[$option][1]);
            }
            else {
                foreach($map as $oldurl => $newurl) {
                    if(strlen($newurl)) {
                        $result = $wpdb->query( $wpdb->prepare( $queries[$option][0], $oldurl, $newurl) );
                        $results[$option] = array($result, $queries[$option][1]);
                    }
                }
            }
        }
        return $results;
    }

    public static function removeUrlProtocol($url) {
        return preg_replace("/^http[s]{0,1}:\/\//", "//", $url);
    }

    /**
     * taken from Velvet Blues Update URLs plugin
     * @param string $from
     * @param string $to
     * @param string $data
     * @param bool|false $serialised
     * @return array|mixed|string
     */
    static function png2JpgUnserializeReplace( $from = '', $to = '', $data = '', $serialised = false ) {
        $replaced = false;
        try {
            if ( false !== is_serialized( $data ) ) {

                if(false === strpos($data, wp_basename($from))) {
                    return (object)array('data' => $data, 'replaced' => false); //quick pre-screening
                }

                $unserialized = unserialize( $data );
                $ret = self::png2JpgUnserializeReplace( $from, $to, $unserialized, true );
                $data = $ret->data;
                $replaced = $replaced || $ret->replaced;
            }
            elseif ( is_array( $data ) ) {
                $_tmp = array( );
                foreach ( $data as $key => $value ) {
                    $ret = self::png2JpgUnserializeReplace( $from, $to, $value, false );
                    $_tmp[ $key ] = $ret->data;
                    $replaced = $replaced || $ret->replaced;
                }
                $data = $_tmp;
                unset( $_tmp );
            }
            elseif(is_object( $data )) {
                foreach(get_object_vars($data) as $key => $value) {
                    $ret = self::png2JpgUnserializeReplace( $from, $to, $value, false );
                    $_tmp[ $key ] = $ret->data;
                    $replaced = $replaced || $ret->replaced;
                }
                $data = (object)$_tmp;
            }
            elseif ( is_string( $data )) {
                if(false !== strpos($data, $from)) {
                    $replaced = true;
                    $data = str_replace( $from, $to, $data );
                } elseif(   strlen($from) > strlen($data) //data is shorter than the url to be replaced - could be a relative path?
                         && strlen($data) >= strlen(wp_basename($from)) //but should at least contain the file name
                         && strpos($from, $data) == strlen($from) - strlen($data)) {
                    $replaced = true;
                    $data = substr($to, strlen($from) - strlen($data));
                }
            }
            if ( $serialised ) {
                return (object)array('data' => serialize($data), 'replaced' => $replaced);
            }
        } catch( Exception $error ) {
        }
        return (object)array('data' => $data, 'replaced' => $replaced);
    }
}