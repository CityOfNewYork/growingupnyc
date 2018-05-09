/**
 * Short Pixel WordPress Plugin javascript
 */

jQuery(document).ready(function($){ShortPixel.init();});


var ShortPixel = function() {

    function init() {
        if (typeof ShortPixel.API_KEY !== 'undefined') return; //was initialized by the 10 sec. setTimeout, rare but who knows, might happen on very slow connections...
        //are we on media list?
        if( jQuery('table.wp-list-table.media').length > 0) {
            //register a bulk action
            jQuery('select[name^="action"] option:last-child').before('<option value="short-pixel-bulk">' + _spTr.optimizeWithSP + '</option>');
        }

        ShortPixel.setOptions(ShortPixelConstants);

        if(jQuery('#backup-folder-size').length) {
            jQuery('#backup-folder-size').html(ShortPixel.getBackupSize());
        }

        if( ShortPixel.MEDIA_ALERT == 'todo' && jQuery('div.media-frame.mode-grid').length > 0) {
            //the media table is not in the list mode, alert the user
            jQuery('div.media-frame.mode-grid').before('<div id="short-pixel-media-alert" class="notice notice-warning"><p>'
                + _spTr.changeMLToListMode.format('<a href="upload.php?mode=list" class="view-list"><span class="screen-reader-text">',' </span>',
                    '</a><a class="alignright" href="javascript:ShortPixel.dismissMediaAlert();">','</a>')
                + '</p></div>');
        }
        //
        jQuery(window).on('beforeunload', function(){
            if(ShortPixel.bulkProcessor == true) {
                clearBulkProcessor();
            }
        });
        //check if  bulk processing
        checkQuotaExceededAlert();
        checkBulkProgress();
    }

    function setOptions(options) {
        for(var opt in options) {
            ShortPixel[opt] = options[opt];
        }
    }
    
    function isEmailValid(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,63})+$/.test(email);
    }
    
    function updateSignupEmail() {
        var email = jQuery('#pluginemail').val();
        if(ShortPixel.isEmailValid(email)) {
            jQuery('#request_key').removeClass('disabled');
        }
        jQuery('#request_key').attr('href', jQuery('#request_key').attr('href').split('?')[0] + '?pluginemail=' + email);
    }
    
    function validateKey(){
        jQuery('#valid').val('validate');
        jQuery('#wp_shortpixel_options').submit();
    }
    
    jQuery("#key").keypress(function(e) {
        if(e.which == 13) {
            jQuery('#valid').val('validate');
        }
    });

    function enableResize(elm) {
        if(jQuery(elm).is(':checked')) {
            jQuery("#width,#height").removeAttr("disabled");
        } else {
            jQuery("#width,#height").attr("disabled", "disabled");
        }
    }
    
    function setupGeneralTab(rad, minWidth, minHeight) {
        for(var i = 0, prev = null; i < rad.length; i++) {
            rad[i].onclick = function() {

                if(this !== prev) {
                    prev = this;
                }
                alert(_spTr.alertOnlyAppliesToNewImages);
            };
        }
        ShortPixel.enableResize("#resize");
        jQuery("#resize").change(function(){ enableResize(this); });
        jQuery(".resize-sizes").blur(function(e){
            var elm = jQuery(this);
            if(ShortPixel.resizeSizesAlert == elm.val()) return;
            ShortPixel.resizeSizesAlert = elm.val();
            var minSize = jQuery("#min-" + elm.attr('name')).val();
            if(elm.val() < Math.min(minSize, 1024)) {
                if(minSize > 1024) {
                    alert( _spTr.pleaseDoNotSetLesser1024.format(elm.attr('name')) );
                } else {
                    alert( _spTr.pleaseDoNotSetLesserSize.format(elm.attr('name'), elm.attr('name'), minSize) );
                }
                e.preventDefault();
                //elm.val(this.defaultValue);
                elm.focus();
            }
            else {
                this.defaultValue = elm.val();
            }
        });
        /*
        jQuery("#width").blur(function(e){
            jQuery(this).val(Math.max(minWidth, parseInt(jQuery(this).val())));
        });
        jQuery("#height").blur(function(e){
            jQuery(this).val(Math.max(minHeight, parseInt(jQuery(this).val())));
        });
        */
        jQuery('.shortpixel-confirm').click(function(event){
            var choice = confirm(event.target.getAttribute('data-confirm'));
            if (!choice) {
                event.preventDefault();
                return false;
            }
            return true;
        });
    }
    
    function setupAdvancedTab() {
        jQuery("input.remove-folder-button").click(function(){
            var path = jQuery(this).data("value");
            var r = confirm(_spTr.areYouSureStopOptimizing.format(path));
            if (r == true) {
                jQuery("#removeFolder").val(path);
                jQuery('#wp_shortpixel_options').submit();
            }
        });
        jQuery("input.recheck-folder-button").click(function(){
            var path = jQuery(this).data("value");
            var r = confirm(_spTr.areYouSureStopOptimizing.format(path));
            if (r == true) {
                jQuery("#recheckFolder").val(path);
                jQuery('#wp_shortpixel_options').submit();
            }
        });
    }

    function checkThumbsUpdTotal(el) {
        var total = jQuery("#" +(el.checked ? "total" : "main")+ "ToProcess").val();
        jQuery("div.bulk-play span.total").text(total);
        jQuery("#displayTotal").text(total);
    }
    
    function switchSettingsTab(target){
        var section = jQuery("section#" +target);
        if(section.length > 0){
            jQuery("section").removeClass("sel-tab");
            jQuery("section#" +target).addClass("sel-tab");
        }
    }
    
    function adjustSettingsTabsHeight(){
        var sectionHeight = jQuery('section#tab-settings .wp-shortpixel-options').height() + 90;
        sectionHeight = Math.max(sectionHeight, jQuery('section#tab-adv-settings .wp-shortpixel-options').height() + 20);
        sectionHeight = Math.max(sectionHeight, jQuery('section#tab-resources .area1').height() + 60);
        jQuery('#shortpixel-settings-tabs').css('height', sectionHeight);
        jQuery('#shortpixel-settings-tabs section').css('height', sectionHeight);
    }

    function dismissMediaAlert() {
        var data = { action  : 'shortpixel_dismiss_media_alert'};
        jQuery.get(ShortPixel.AJAX_URL, data, function(response) {
            data = JSON.parse(response);
            if(data["Status"] == 'success') {
                jQuery("#short-pixel-media-alert").hide();
                console.log("dismissed");
            }
        });
    }
    
    function checkQuota() {
        var data = { action  : 'shortpixel_check_quota'};
        jQuery.get(ShortPixel.AJAX_URL, data, function() {
            console.log("quota refreshed");
        });
    }
    
    function onBulkThumbsCheck(check) {
        if(check.checked) {
            jQuery("#with-thumbs").css('display', 'inherit');
            jQuery("#without-thumbs").css('display', 'none');
        } else {
            jQuery("#without-thumbs").css('display', 'inherit');
            jQuery("#with-thumbs").css('display', 'none');
        }
    }
    
    function successMsg(id, percent, type, thumbsCount, retinasCount) {
        return (percent > 0 ? "<div class='sp-column-info'>" + _spTr.reducedBy + " <strong><span class='percent'>" + percent + "%</span></strong> " : "")
             + (percent > 0 && percent < 5 ? "<br>" : '')
             + (percent < 5 ? _spTr.bonusProcessing : '')
             + (type.length > 0 ? " ("+type+")" : "")
             + (0 + thumbsCount > 0 ? "<br>" + _spTr.plusXthumbsOpt.format(thumbsCount) :"")
             + (0 + retinasCount > 0 ? "<br>" + _spTr.plusXretinasOpt.format(retinasCount) :"")
             + "</div>";
    }
    
    function percentDial(query, size) {
        jQuery(query).knob({
            'readOnly': true,
            'width': size,
            'height': size,
            'fgColor': '#1CAECB',
            'format' : function (value) {
                 return value + '%';
            }
        });
    }   
    
    function successActions(id, type, thumbsCount, thumbsTotal, backupEnabled, fileName) {
        if(backupEnabled == 1) {
            
            var successActions = jQuery('.sp-column-actions-template').clone();

            if(!successActions.length) return false;           
            
            var otherTypes;
            if(type.length == 0) {
                otherTypes = ['lossy', 'lossless'];
            } else {
                otherTypes = ['lossy','glossy','lossless'].filter(function(el) {return !(el == type);});
            }        
            
            successActions.html(successActions.html().replace(/__SP_ID__/g, id));
            if(fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase() == 'pdf') {
                jQuery('.sp-action-compare', successActions).remove();
            }
            if(thumbsCount == 0 && thumbsTotal > 0) {
                successActions.html(successActions.html().replace('__SP_THUMBS_TOTAL__', thumbsTotal));
            } else {
                jQuery('.sp-action-optimize-thumbs', successActions).remove();
                jQuery('.sp-dropbtn', successActions).removeClass('button-primary');
            }
            successActions.html(successActions.html().replace(/__SP_FIRST_TYPE__/g, otherTypes[0]));
            successActions.html(successActions.html().replace(/__SP_SECOND_TYPE__/g, otherTypes[1]));
            return successActions.html();
        } 
        return "";
    }
    
    function otherMediaUpdateActions(id, actions) {
        id = id.substring(2);
        if(jQuery(".shortpixel-other-media").length) {
            var allActions = ['optimize', 'retry', 'restore','redo', 'quota', 'view'];
            for(var i=0,  tot=allActions.length; i < tot; i++) {
                jQuery("#"+allActions[i]+"_"+id).css("display", "none");
            }
            for(var i=0,  tot=actions.length; i < tot; i++) {
                jQuery("#"+actions[i]+"_"+id).css("display", "");
            }
        }
    }
    
    function retry(msg) {
        ShortPixel.retries++;
        if(isNaN(ShortPixel.retries)) ShortPixel.retries = 1;
        if(ShortPixel.retries < 6) {
            console.log("Invalid response from server (Error: " + msg + "). Retrying pass " + (ShortPixel.retries + 1) +  "...");
            setTimeout(checkBulkProgress, 5000);
        } else {
            ShortPixel.bulkShowError(-1,"Invalid response from server received 6 times. Please retry later by reloading this page, or <a href='https://shortpixel.com/contact' target='_blank'>contact support</a>. (Error: " + msg + ")", "");
            console.log("Invalid response from server 6 times. Giving up.");                    
        }
    }
    
    function browseContent(browseData) {
        browseData.action = 'shortpixel_browse_content';
        var browseResponse = "";
        jQuery.ajax({
            type: "POST",
            url: ShortPixel.AJAX_URL, 
            data: browseData, 
            success: function(response) {
                 browseResponse = response;
            },
            async: false
        });
        return browseResponse;
    }
    
    function getBackupSize() {
        var browseData = { 'action': 'shortpixel_get_backup_size'};
        var browseResponse = "";
        jQuery.ajax({
            type: "POST",
            url: ShortPixel.AJAX_URL, 
            data: browseData, 
            success: function(response) {
                 browseResponse = response;
            },
            async: false
        });
        return browseResponse;
    }

    function newApiKey(event) {
        jQuery('#request_key').addClass('disabled');
        jQuery('#pluginemail_spinner').addClass('is-active');
        ShortPixel.updateSignupEmail();
        if (ShortPixel.isEmailValid(jQuery('#pluginemail').val())) {
            jQuery('#pluginemail-error').css('display', 'none');
            var browseData = { 'action': 'shortpixel_new_api_key',
                               'email': jQuery('#pluginemail').val()};
            jQuery.ajax({
                type: "POST",
                async: false,
                url: ShortPixel.AJAX_URL, 
                data: browseData, 
                success: function(response) {
                    data = JSON.parse(response);
                    if(data["Status"] == 'success') {
                        event.preventDefault();
                        window.location.reload();
                    } else if(data["Status"] == 'invalid') {
                        jQuery('#pluginemail-error').html('<b>' + data['Details'] + '</b>');
                        jQuery('#pluginemail-error').css('display', '');
                        jQuery('#pluginemail-info').css('display', 'none');
                        event.preventDefault();
                    } else {
                    }
                }
            });
            jQuery('#request_key').removeAttr('onclick');
        } else {
            jQuery('#pluginemail-error').css('display', '');
            jQuery('#pluginemail-info').css('display', 'none');
            event.preventDefault();
        }
        jQuery('#request_key').removeClass('disabled');
        jQuery('#pluginemail_spinner').removeClass('is-active');
    }
    
    function proposeUpgrade() {
        //first open the popup window with the spinner
        jQuery("#shortPixelProposeUpgrade .sp-modal-body").addClass('sptw-modal-spinner');
        jQuery("#shortPixelProposeUpgrade .sp-modal-body").html("");
        jQuery("#shortPixelProposeUpgradeShade").css("display", "block");
        jQuery("#shortPixelProposeUpgrade").removeClass('shortpixel-hide');
        //get proposal from server
        var browseData = { 'action': 'shortpixel_propose_upgrade'};
        jQuery.ajax({
            type: "POST",
            url: ShortPixel.AJAX_URL, 
            data: browseData, 
            success: function(response) {
                jQuery("#shortPixelProposeUpgrade .sp-modal-body").removeClass('sptw-modal-spinner');
                jQuery("#shortPixelProposeUpgrade .sp-modal-body").html(response);
            }
        });
    }
        
    function closeProposeUpgrade() {
        jQuery("#shortPixelProposeUpgradeShade").css("display", "none");
        jQuery("#shortPixelProposeUpgrade").addClass('shortpixel-hide');
        if(ShortPixel.toRefresh) {
            ShortPixel.recheckQuota();
        }
    }
    
    function includeUnlisted() {
    jQuery("#short-pixel-notice-unlisted").hide();
    jQuery("#optimizeUnlisted").prop('checked', true);
    var data = { action  : 'shortpixel_dismiss_notice',
                 notice_id: 'unlisted',
                 notice_data: 'true'};
    jQuery.get(ShortPixel.AJAX_URL, data, function(response) {
        data = JSON.parse(response);
        if(data["Status"] == ShortPixel.STATUS_SUCCESS) {
            console.log("dismissed");
        }
    });
}

    
    function initFolderSelector() {
        jQuery(".select-folder-button").click(function(){
            jQuery(".sp-folder-picker-shade").css("display", "block");
            jQuery(".sp-folder-picker").fileTree({
                script: ShortPixel.browseContent,
                //folderEvent: 'dblclick',
                multiFolder: false
                //onlyFolders: true
            });
        });
        jQuery(".shortpixel-modal input.select-folder-cancel").click(function(){
            jQuery(".sp-folder-picker-shade").css("display", "none");
        });
        jQuery(".shortpixel-modal input.select-folder").click(function(){
            var subPath = jQuery("UL.jqueryFileTree LI.directory.selected A").attr("rel").trim();
            if(subPath) {
                var fullPath = jQuery("#customFolderBase").val() + subPath;
                if(fullPath.slice(-1) == '/') fullPath = fullPath.slice(0, -1);
                jQuery("#addCustomFolder").val(fullPath);
                jQuery("#addCustomFolderView").val(fullPath);
                jQuery(".sp-folder-picker-shade").css("display", "none");
            } else {
                alert("Please select a folder from the list.");
            }
        });
    }
    
    function bulkShowLengthyMsg(id, fileName, customLink){
        var notice = jQuery(".bulk-notice-msg.bulk-lengthy");
        if(notice.length == 0) return;
        var link = jQuery("a", notice);
        link.text(fileName);
        if(customLink) {
            link.attr("href", customLink);
        } else {
            link.attr("href", link.data("href").replace("__ID__", id));
        }
        
        notice.css("display", "block");
    }
    
    function bulkHideLengthyMsg(){
        jQuery(".bulk-notice-msg.bulk-lengthy").css("display", "none");
    }
    
    function bulkShowMaintenanceMsg(type){
        var notice = jQuery(".bulk-notice-msg.bulk-" + type);
        if(notice.length == 0) return;
        notice.css("display", "block");
    }
    
    function bulkHideMaintenanceMsg(type){
        jQuery(".bulk-notice-msg.bulk-" + type).css("display", "none");
    }
    
    function bulkShowError(id, msg, fileName, customLink) {
        var noticeTpl = jQuery("#bulk-error-template");
        if(noticeTpl.length == 0) return;
        var notice = noticeTpl.clone();
        notice.attr("id", "bulk-error-" + id);
        if(id == -1) {
            jQuery("span.sp-err-title", notice).remove();
            notice.addClass("bulk-error-fatal");
        } else {
            jQuery("img", notice).remove();
            jQuery("#bulk-error-" . id).remove();
        }
        jQuery("span.sp-err-content", notice).html(msg);
        var link = jQuery("a.sp-post-link", notice);
        if(customLink) {
            link.attr("href", customLink);
        } else {
           link.attr("href", link.attr("href").replace("__ID__", id));
        }
        link.text(fileName);
        noticeTpl.after(notice);
        notice.css("display", "block");        
    }
    
    function confirmBulkAction(type, e) {
        if(!confirm(_spTr['confirmBulk' + type])) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        return true;
    }

    function removeBulkMsg(me) {
        jQuery(me).parent().parent().remove();
    }
    
    function isCustomImageId(id) {
        return id.substring(0,2) == "C-";
    }
    
    function recheckQuota() {
        window.location.href=window.location.href+(window.location.href.indexOf('?')>0?'&':'?')+'checkquota=1';
    }
    
    function openImageMenu(e) {
            e.preventDefault();
            //install (lazily) a window click event to close the menus
            if(!this.menuCloseEvent) {
                jQuery(window).click(function(e){
                    if (!e.target.matches('.sp-dropbtn')) {
                        jQuery('.sp-dropdown.sp-show').removeClass('sp-show');
                    }
                });
                this.menuCloseEvent = true;
            }
            var shown = e.target.parentElement.classList.contains("sp-show");
            jQuery('.sp-dropdown.sp-show').removeClass('sp-show');
            if(!shown) e.target.parentElement.classList.add("sp-show");
    }
    
    function loadComparer(id) {
        this.comparerData.origUrl = false;
        
        if(this.comparerData.cssLoaded === false) {
            jQuery('<link>')
                .appendTo('head')
                .attr({
                    type: 'text/css', 
                    rel: 'stylesheet',
                    href: this.WP_PLUGIN_URL + '/res/css/twentytwenty.min.css'
                });
            this.comparerData.cssLoaded = 2;
        }
        if(this.comparerData.jsLoaded === false) {
            jQuery.getScript(this.WP_PLUGIN_URL + '/res/js/jquery.twentytwenty.min.js', function(){
                ShortPixel.comparerData.jsLoaded = 2;
                if(ShortPixel.comparerData.origUrl.length > 0) {
                    ShortPixel.displayComparerPopup(ShortPixel.comparerData.width, ShortPixel.comparerData.height, ShortPixel.comparerData.origUrl, ShortPixel.comparerData.optUrl);
                }
            });
            this.comparerData.jsLoaded = 1;
            jQuery(".sp-close-button").click(ShortPixel.closeComparerPopup);
        }
        if(this.comparerData.origUrl === false) {
            jQuery.ajax({
                type: "POST",
                url: ShortPixel.AJAX_URL, 
                data: { action : 'shortpixel_get_comparer_data', id : id }, 
                success: function(response) {
                    data = JSON.parse(response);
                    jQuery.extend(ShortPixel.comparerData, data);
                    if(ShortPixel.comparerData.jsLoaded == 2) {
                        ShortPixel.displayComparerPopup(ShortPixel.comparerData.width, ShortPixel.comparerData.height, ShortPixel.comparerData.origUrl, ShortPixel.comparerData.optUrl);
                    }
                }
            });
            this.comparerData.origUrl = '';
        }
    }

    function displayComparerPopup(width, height, imgOriginal, imgOptimized) {
        //image sizes
        var origWidth = width;
        //depending on the sizes choose the right modal
        var sideBySide = (height < 150 || width < 350);
        var modal = jQuery(sideBySide ? '#spUploadCompareSideBySide' : '#spUploadCompare');
        if(!sideBySide) {
            jQuery("#spCompareSlider").html('<img class="spUploadCompareOriginal"/><img class="spUploadCompareOptimized"/>');
        }
        //calculate the modal size
        width = Math.max(350, Math.min(800, (width < 350 ? (width + 25) * 2 : (height < 150 ? width + 25 : width))));
        height = Math.max(150, (sideBySide ? (origWidth > 350 ? 2 * (height + 45) : height + 45) : height * width / origWidth));
        //set modal sizes and display
        jQuery(".sp-modal-body", modal).css("width", width);
        jQuery(".shortpixel-slider", modal).css("width", width);
        modal.css("width", width);
        jQuery(".sp-modal-body", modal).css("height", height);
        modal.css('display', 'block');
        modal.parent().css('display', 'block');
        if(!sideBySide) {
            jQuery("#spCompareSlider").twentytwenty({slider_move: "mousemove"});
        }
        jQuery(document).on('keyup.sp_modal_active', ShortPixel.closeComparerPopup);
        //change images srcs
        var imgOpt = jQuery(".spUploadCompareOptimized", modal);
        jQuery(".spUploadCompareOriginal", modal).attr("src", imgOriginal);
        //these timeouts are for the slider - it needs a punch to work :)
        setTimeout(function(){
            jQuery(window).trigger('resize');
        }, 1000);
        imgOpt.load(function(){
            jQuery(window).trigger('resize');
        });
        imgOpt.attr("src", imgOptimized);
    }
    
    function closeComparerPopup(e) {
        jQuery("#spUploadCompareSideBySide").parent().css("display", 'none');
        jQuery("#spUploadCompareSideBySide").css("display", 'none');
        jQuery("#spUploadCompare").css("display", 'none');
        jQuery(document).unbind('keyup.sp_modal_active');
    }

    return {
        init                : init,
        setOptions          : setOptions,
        isEmailValid        : isEmailValid,
        updateSignupEmail   : updateSignupEmail,
        validateKey         : validateKey,
        enableResize        : enableResize,
        setupGeneralTab     : setupGeneralTab,
        setupAdvancedTab    : setupAdvancedTab,
        checkThumbsUpdTotal : checkThumbsUpdTotal,
        switchSettingsTab   : switchSettingsTab,
        adjustSettingsTabs  : adjustSettingsTabsHeight,
        onBulkThumbsCheck   : onBulkThumbsCheck,
        dismissMediaAlert   : dismissMediaAlert,
        checkQuota          : checkQuota,
        percentDial         : percentDial,
        successMsg          : successMsg,
        successActions      : successActions,
        otherMediaUpdateActions: otherMediaUpdateActions,
        retry               : retry,
        initFolderSelector  : initFolderSelector,
        browseContent       : browseContent,
        getBackupSize       : getBackupSize,
        newApiKey           : newApiKey,
        proposeUpgrade      : proposeUpgrade,
        closeProposeUpgrade : closeProposeUpgrade,
        includeUnlisted     : includeUnlisted,
        bulkShowLengthyMsg  : bulkShowLengthyMsg,
        bulkHideLengthyMsg  : bulkHideLengthyMsg,
        bulkShowMaintenanceMsg  : bulkShowMaintenanceMsg,
        bulkHideMaintenanceMsg  : bulkHideMaintenanceMsg,
        bulkShowError       : bulkShowError,
        confirmBulkAction  : confirmBulkAction,
        removeBulkMsg       : removeBulkMsg,
        isCustomImageId     : isCustomImageId,
        recheckQuota        : recheckQuota,
        openImageMenu       : openImageMenu,
        menuCloseEvent      : false,
        loadComparer        : loadComparer,
        displayComparerPopup: displayComparerPopup,
        closeComparerPopup  : closeComparerPopup,
        comparerData        : {
            cssLoaded   : false,
            jsLoaded    : false,
            origUrl     : false,
            optUrl      : false,
            width       : 0,
            height      : 0
        },
        toRefresh       : false,
        resizeSizesAlert: false
    }
}();

function showToolBarAlert($status, $message, id) {
    var robo = jQuery("li.shortpixel-toolbar-processing");
    switch($status) {
        case ShortPixel.STATUS_QUOTA_EXCEEDED:
            if(  window.location.href.search("wp-short-pixel-bulk") > 0 
              && jQuery(".sp-quota-exceeded-alert").length == 0) { //if we're in bulk and the alert is not displayed reload to see all options
                location.reload();
                return;
            }
            robo.addClass("shortpixel-alert");
            robo.addClass("shortpixel-quota-exceeded");
            jQuery("a", robo).attr("href", "options-general.php?page=wp-shortpixel");
            //jQuery("a", robo).attr("target", "_blank");
            //jQuery("a div", robo).attr("title", "ShortPixel quota exceeded. Click to top-up");
            jQuery("a div", robo).attr("title", "ShortPixel quota exceeded. Click for details.");
            break;
        case ShortPixel.STATUS_SKIP:        
        case ShortPixel.STATUS_FAIL:
            robo.addClass("shortpixel-alert shortpixel-processing");
            jQuery("a div", robo).attr("title", $message);
            if(typeof id !== 'undefined') {
                jQuery("a", robo).attr("href", "post.php?post=" + id + "&action=edit");
            }
            break;
        case ShortPixel.STATUS_NO_KEY:
            robo.addClass("shortpixel-alert");
            robo.addClass("shortpixel-quota-exceeded");
            jQuery("a", robo).attr("href", "options-general.php?page=wp-shortpixel");//"http://shortpixel.com/wp-apikey");
            //jQuery("a", robo).attr("target", "_blank");
            jQuery("a div", robo).attr("title", "Get API Key");
            break;
        case ShortPixel.STATUS_SUCCESS:
        case ShortPixel.STATUS_RETRY:
            robo.addClass("shortpixel-processing");
            robo.removeClass("shortpixel-alert");
            jQuery("a", robo).removeAttr("target");
            jQuery("a", robo).attr("href", jQuery("a img", robo).attr("success-url"));
    }
    robo.removeClass("shortpixel-hide");
}
function hideToolBarAlert () {
    jQuery("li.shortpixel-toolbar-processing.shortpixel-processing").addClass("shortpixel-hide");
}

function hideQuotaExceededToolBarAlert () {
    jQuery("li.shortpixel-toolbar-processing.shortpixel-quota-exceeded").addClass("shortpixel-hide");
}

function checkQuotaExceededAlert() {
    if(typeof shortPixelQuotaExceeded != 'undefined') {
        if(shortPixelQuotaExceeded == 1) {
             showToolBarAlert(ShortPixel.STATUS_QUOTA_EXCEEDED);
        } else {
            hideQuotaExceededToolBarAlert();
        }
    }
}
/**
 * JavaScript image processing - this method gets executed on every footer load and afterwards 
 * calls itself until receives an Empty queue message
 */
function checkBulkProgress() {
    //the replace stands for malformed urls on some sites, like wp-admin//upload.php which are accepted by the browser. 
    //using a replacer function to avoid replacing the first occurence (https:// ...)
    var replacer = function(match) {
        if(!first) {
            first = true;
            return match;
        }
        return '/';
    };

    var first = false; //arm replacer
    var url = window.location.href.toLowerCase().replace(/\/\//g , replacer);
    
    first = false; //rearm replacer
    var adminUrl = ShortPixel.WP_ADMIN_URL.toLowerCase().replace(/\/\//g , replacer);
    
    //handle possible Punycode domain names.
    if(url.search(adminUrl) < 0) {
        var parser = document.createElement('a');
        parser.href = url;
        url = url.replace(parser.protocol + '//' + parser.hostname,  parser.protocol + '//' + parser.hostname.split('.').map(function(part) {return sp_punycode.toASCII(part)}).join('.'));
    }
    
    if(   url.search(adminUrl + "upload.php") < 0
       && url.search(adminUrl + "edit.php") < 0
       && url.search(adminUrl + "edit-tags.php") < 0
       && url.search(adminUrl + "post-new.php") < 0
       && url.search(adminUrl + "post.php") < 0
       && url.search("page=nggallery-manage-gallery") < 0
       && (ShortPixel.FRONT_BOOTSTRAP == 0 || url.search(adminUrl) == 0)
       ) {
        hideToolBarAlert();
        return;
    }
    
    //if i'm the bulk processor and i'm not the bulk page and a bulk page comes around, leave the bulk processor role
    if(ShortPixel.bulkProcessor == true && window.location.href.search("wp-short-pixel-bulk") < 0 
       && typeof localStorage.bulkPage !== 'undefined' && localStorage.bulkPage > 0) {
           ShortPixel.bulkProcessor = false;
    }
    
    //if i'm the bulk page, steal the bulk processor
    if( window.location.href.search("wp-short-pixel-bulk") >= 0 ) {
        ShortPixel.bulkProcessor = true;
        localStorage.bulkTime = Math.floor(Date.now() / 1000);
        localStorage.bulkPage = 1;
    }
    
    //if I'm not the bulk processor, check every 20 sec. if the bulk processor is running, otherwise take the role
    if(ShortPixel.bulkProcessor == true || typeof localStorage.bulkTime == 'undefined' || Math.floor(Date.now() / 1000) -  localStorage.bulkTime > 90) {
        ShortPixel.bulkProcessor = true;
        localStorage.bulkPage = (window.location.href.search("wp-short-pixel-bulk") >= 0 ? 1 : 0);
        localStorage.bulkTime = Math.floor(Date.now() / 1000);
        console.log(localStorage.bulkTime);
        checkBulkProcessingCallApi();
    } else {
        setTimeout(checkBulkProgress, 5000);
    }
}

function checkBulkProcessingCallApi(){
    var data = { 'action': 'shortpixel_image_processing' };
    // since WP 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
    jQuery.ajax({
        type: "POST",
        url: ShortPixel.AJAX_URL, //formerly ajaxurl , but changed it because it's not available in the front-end and now we have an option to run in the front-end
        data: data, 
        success: function(response) 
        {
            if(response.length > 0) {
                var data = null;
                try {
                    var data = JSON.parse(response);
                } catch (e) {
                    ShortPixel.retry(e.message);
                    return;
                }
                ShortPixel.retries = 0;
                
                var id = data["ImageID"];

                var isBulkPage = (jQuery("div.short-pixel-bulk-page").length > 0);

                switch (data["Status"]) {
                    case ShortPixel.STATUS_NO_KEY:
                        setCellMessage(id, data["Message"], "<a class='button button-smaller button-primary' href=\"https://shortpixel.com/wp-apikey"
                                       + ShortPixel.AFFILIATE + "\" target=\"_blank\">" + _spTr.getApiKey + "</a>");
                        showToolBarAlert(ShortPixel.STATUS_NO_KEY);
                        break;
                    case ShortPixel.STATUS_QUOTA_EXCEEDED:
                        setCellMessage(id, data["Message"], "<a class='button button-smaller button-primary' href=\"https://shortpixel.com/login/" 
                                       + ShortPixel.API_KEY + "\" target=\"_blank\">" + _spTr.extendQuota + "</a>"
                                       + "<a class='button button-smaller' href='admin.php?action=shortpixel_check_quota'>" + _spTr.check__Quota + "</a>");
                        showToolBarAlert(ShortPixel.STATUS_QUOTA_EXCEEDED);
                        if(data['Stop'] == false) { //there are other items in the priority list, maybe processed, try those
                            setTimeout(checkBulkProgress, 5000);
                        }
                        ShortPixel.otherMediaUpdateActions(id, ['quota','view']);
                        break;
                    case ShortPixel.STATUS_FAIL:
                        setCellMessage(id, data["Message"], "<a class='button button-smaller button-primary' href=\"javascript:manualOptimization('" + id + "', false)\">" 
                                + _spTr.retry + "</a>");
                        showToolBarAlert(ShortPixel.STATUS_FAIL, data["Message"], id);
                        if(isBulkPage) {
                            ShortPixel.bulkShowError(id, data["Message"], data["Filename"], data["CustomImageLink"]);
                            if(data["BulkPercent"]) {
                                progressUpdate(data["BulkPercent"], data["BulkMsg"]);
                            }
                            ShortPixel.otherMediaUpdateActions(id, ['retry','view']);
                        }
                        console.log(data["Message"]);
                        setTimeout(checkBulkProgress, 5000);
                        break;
                    case ShortPixel.STATUS_EMPTY_QUEUE:
                        console.log(data["Message"]);
                        clearBulkProcessor(); //nothing to process, leave the role. Next page load will check again
                        hideToolBarAlert();
                        var progress = jQuery("#bulk-progress");
                        if(isBulkPage && progress.length && data["BulkStatus"] != '2') {
                            progressUpdate(100, "Bulk finished!");
                            jQuery("a.bulk-cancel").attr("disabled", "disabled");
                            hideSlider();
                            //showStats();
                            setTimeout(function(){
                                window.location.reload();
                            }, 3000);
                        }
                        break;
                    case ShortPixel.STATUS_SUCCESS:
                        if(isBulkPage) {
                            ShortPixel.bulkHideLengthyMsg();
                            ShortPixel.bulkHideMaintenanceMsg();
                        }
                        var percent = data["PercentImprovement"];

                        showToolBarAlert(ShortPixel.STATUS_SUCCESS, "");
                        //for now, until 4.1
                        var successActions = ShortPixel.isCustomImageId(id) 
                            ? "" 
                            : ShortPixel.successActions(id, data["Type"], data['ThumbsCount'], data['ThumbsTotal'], data["BackupEnabled"], data['Filename']);
                            
                        setCellMessage(id, ShortPixel.successMsg(id, percent, data["Type"], data['ThumbsCount'], data['RetinasCount']), successActions);
                        var actions = jQuery(['restore', 'view', 'redolossy', 'redoglossy', 'redolossless']).not(['redo'+data["Type"]]).get();
                        ShortPixel.otherMediaUpdateActions(id, actions);
                        var animator = new PercentageAnimator("#sp-msg-" + id + " span.percent", percent);
                        animator.animate(percent);
                        if(isBulkPage && typeof data["Thumb"] !== 'undefined') { // && data["PercentImprovement"] > 0) {
                            if(data["BulkPercent"]) {
                                progressUpdate(data["BulkPercent"], data["BulkMsg"]);
                            }
                            if(data["Thumb"].length > 0){
                                sliderUpdate(id, data["Thumb"], data["BkThumb"], data["PercentImprovement"], data["Filename"]);
                                if(typeof data["AverageCompression"] !== 'undefined' && 0 + data["AverageCompression"] > 0){
                                    jQuery("#sp-avg-optimization").html('<input type="text" class="dial" value="' + Math.round(data["AverageCompression"]) + '"/>');
                                    ShortPixel.percentDial("#sp-avg-optimization .dial", 60);
                                }
                            }
                        }                    
                        console.log('Server response: ' + response);
                        if(isBulkPage && typeof data["BulkPercent"] !== 'undefined') {
                            progressUpdate(data["BulkPercent"], data["BulkMsg"]);
                        }
                        setTimeout(checkBulkProgress, 5000);
                        break;

                    case ShortPixel.STATUS_SKIP:
                        if(data["Silent"] !== 1) {
                            ShortPixel.bulkShowError(id, data["Message"], data["Filename"], data["CustomImageLink"]);
                        }
                        //fall through
                    case ShortPixel.STATUS_ERROR: //for error and skip also we retry
                        if(typeof data["Message"] !== 'undefined') {
                            showToolBarAlert(ShortPixel.STATUS_SKIP, data["Message"] + ' Image ID: ' + id);
                            setCellMessage(id, data["Message"], "");
                        }
                        ShortPixel.otherMediaUpdateActions(id, ['retry','view']);
                        //fall through
                    case ShortPixel.STATUS_RETRY:
                        console.log('Server response: ' + response);
                        showToolBarAlert(ShortPixel.STATUS_RETRY, "");
                        if(isBulkPage && typeof data["BulkPercent"] !== 'undefined') {
                            progressUpdate(data["BulkPercent"], data["BulkMsg"]);
                        }
                        if(isBulkPage && data["Count"] > 3) {
                            ShortPixel.bulkShowLengthyMsg(id, data["Filename"], data["CustomImageLink"]);
                        }
                        setTimeout(checkBulkProgress, 5000);
                        break;
                    case ShortPixel.STATUS_MAINTENANCE:
                        ShortPixel.bulkShowMaintenanceMsg('maintenance');
                        setTimeout(checkBulkProgress, 60000);
                        break;
                    case ShortPixel.STATUS_QUEUE_FULL:
                        ShortPixel.bulkShowMaintenanceMsg('queue-full');
                        setTimeout(checkBulkProgress, 60000);
                        break;
                    default:
                        ShortPixel.retry("Unknown status " + data["Status"] + ". Retrying...");
                        break;
                }
            }
        },
        error: function(response){
            ShortPixel.retry(response.statusText);
        }
    });
}

function clearBulkProcessor(){
    ShortPixel.bulkProcessor = false; //nothing to process, leave the role. Next page load will check again
    localStorage.bulkTime = 0;
    if(window.location.href.search("wp-short-pixel-bulk") >= 0) {
        localStorage.bulkPage = 0;
    }
}

function setCellMessage(id, message, actions){
    var msg = jQuery("#sp-msg-" + id);
    if(msg.length > 0) {
        msg.html("<div class='sp-column-actions'>" + actions + "</div>"
                 + "<div class='sp-column-info'>" + message + "</div>");
        msg.css("color", "");
    }    
    msg = jQuery("#sp-cust-msg-" + id);
    if(msg.length > 0) {
        msg.html("<div class='sp-column-info'>" + message + "</div>");
    }    
}

function manualOptimization(id, cleanup) {
    setCellMessage(id, "<img src='" + ShortPixel.WP_PLUGIN_URL + "/res/img/loading.gif' class='sp-loading-small'>Image waiting to be processed", "");
    jQuery("li.shortpixel-toolbar-processing").removeClass("shortpixel-hide");
    jQuery("li.shortpixel-toolbar-processing").removeClass("shortpixel-alert");
    jQuery("li.shortpixel-toolbar-processing").addClass("shortpixel-processing");
    var data = { action  : 'shortpixel_manual_optimization',
                 image_id: id, cleanup: cleanup};
    jQuery.ajax({
        type: "GET",
        url: ShortPixel.AJAX_URL, //formerly ajaxurl , but changed it because it's not available in the front-end and now we have an option to run in the front-end
        data: data,
        success: function(response) {
            var resp = JSON.parse(response);
            if(resp["Status"] == ShortPixel.STATUS_SUCCESS) {
                setTimeout(checkBulkProgress, 2000);
            } else {
                setCellMessage(id, typeof resp["Message"] !== "undefined" ? resp["Message"] : _spTr.thisContentNotProcessable, "");
            }
        //aici e aici
        },
        error: function(response){
            //if error, give the ajax processor a chance to maybe find out why.
            data.action = 'shortpixel_check_status'
            jQuery.ajax({
                type: "GET",
                url: ShortPixel.AJAX_URL, //formerly ajaxurl , but changed it because it's not available in the front-end and now we have an option to run in the front-end
                data: data,
                success: function (response) {
                    var resp = JSON.parse(response);
                    if (resp["Status"] !== ShortPixel.STATUS_SUCCESS) {
                        setCellMessage(id, typeof resp["Message"] !== "undefined" ? resp["Message"] : _spTr.thisContentNotProcessable, "");
                    }
                    //aici e aici
                }
            });
        }
    });
}

function reoptimize(id, type) {
    setCellMessage(id, "<img src='" + ShortPixel.WP_PLUGIN_URL + "/res/img/loading.gif' class='sp-loading-small'>Image waiting to be reprocessed", "");
    jQuery("li.shortpixel-toolbar-processing").removeClass("shortpixel-hide");
    jQuery("li.shortpixel-toolbar-processing").addClass("shortpixel-processing");
    var data = { action  : 'shortpixel_redo',
                 attachment_ID: id,
                 type: type};
    jQuery.get(ShortPixel.AJAX_URL, data, function(response) {
        data = JSON.parse(response);
        if(data["Status"] == ShortPixel.STATUS_SUCCESS) {
            setTimeout(checkBulkProgress, 2000);
        } else {
            $msg = typeof data["Message"] !== "undefined" ? data["Message"] : _spTr.thisContentNotProcessable;
            setCellMessage(id, $msg, "");
            showToolBarAlert(ShortPixel.STATUS_FAIL, $msg);
        }
    });
}

function optimizeThumbs(id) {
    setCellMessage(id, "<img src='" + ShortPixel.WP_PLUGIN_URL + "/res/img/loading.gif' class='sp-loading-small'>" + _spTr.imageWaitOptThumbs, "");
    jQuery("li.shortpixel-toolbar-processing").removeClass("shortpixel-hide");
    jQuery("li.shortpixel-toolbar-processing").addClass("shortpixel-processing");
    var data = { action  : 'shortpixel_optimize_thumbs',
                 attachment_ID: id};
    jQuery.get(ShortPixel.AJAX_URL, data, function(response) {
        data = JSON.parse(response);
        if(data["Status"] == ShortPixel.STATUS_SUCCESS) {
            setTimeout(checkBulkProgress, 2000);
        } else {
            setCellMessage(id, typeof data["Message"] !== "undefined" ? data["Message"] : _spTr.thisContentNotProcessable, "");
        }
    });
}

function dismissShortPixelNoticeExceed(e) {
    jQuery("#wp-admin-bar-shortpixel_processing").hide();
    var data = { action  : 'shortpixel_dismiss_notice',
                 notice_id: 'exceed'};
    jQuery.get(ShortPixel.AJAX_URL, data, function(response) {
        data = JSON.parse(response);
        if(data["Status"] == ShortPixel.STATUS_SUCCESS) {
            console.log("dismissed");
        }
    });
    e.preventDefault();
}

function dismissShortPixelNotice(id) {
    jQuery("#short-pixel-notice-" + id).hide();
    var data = { action  : 'shortpixel_dismiss_notice',
                 notice_id: id};
    jQuery.get(ShortPixel.AJAX_URL, data, function(response) {
        data = JSON.parse(response);
        if(data["Status"] == ShortPixel.STATUS_SUCCESS) {
            console.log("dismissed");
        }
    });
}

function PercentageAnimator(outputSelector, targetPercentage) {
    this.animationSpeed = 10;
    this.increment = 2;
    this.curPercentage = 0;
    this.targetPercentage = targetPercentage;
    this.outputSelector = outputSelector;
    
    this.animate = function(percentage) {
        this.targetPercentage = percentage;
        setTimeout(PercentageTimer.bind(null, this), this.animationSpeed);
    }
}

function PercentageTimer(animator) {
    if (animator.curPercentage - animator.targetPercentage < -animator.increment) {
        animator.curPercentage += animator.increment;    
    } else if (animator.curPercentage - animator.targetPercentage > animator.increment) {
        animator.curPercentage -= animator.increment;    
    } else {
        animator.curPercentage = animator.targetPercentage;
    }

    jQuery(animator.outputSelector).text(animator.curPercentage + "%");

    if (animator.curPercentage != animator.targetPercentage) {
        setTimeout(PercentageTimer.bind(null,animator), animator.animationSpeed)    
    }
}

function progressUpdate(percent, message) {
    var progress = jQuery("#bulk-progress");
    if(progress.length) {
        jQuery(".progress-left", progress).css("width", percent + "%");
        jQuery(".progress-img", progress).css("left", percent + "%");
        if(percent > 24) {
            jQuery(".progress-img span", progress).html("");
            jQuery(".progress-left", progress).html(percent + "%");
        } else {
            jQuery(".progress-img span", progress).html(percent + "%");
            jQuery(".progress-left", progress).html("");        
        }
        jQuery(".bulk-estimate").html(message);
    }
}



function sliderUpdate(id, thumb, bkThumb, percent, filename){
    var oldSlide = jQuery(".bulk-slider div.bulk-slide:first-child");
    if(oldSlide.length === 0) {
        return;
    }    
    if(oldSlide.attr("id") != "empty-slide") {
        oldSlide.hide();
    }
    oldSlide.css("z-index", 1000);
    jQuery(".bulk-img-opt", oldSlide).attr("src", "");
    if(typeof bkThumb === 'undefined') {
        bkThumb = '';
    }
    if(bkThumb.length > 0) {
        jQuery(".bulk-img-orig", oldSlide).attr("src", "");
    }

    var newSlide = oldSlide.clone();
    newSlide.attr("id", "slide-" + id);
    jQuery(".bulk-img-opt", newSlide).attr("src", thumb);
    if(bkThumb.length > 0) {
        jQuery(".img-original", newSlide).css("display", "inline-block");
        jQuery(".bulk-img-orig", newSlide).attr("src", bkThumb);
    } else {
        jQuery(".img-original", newSlide).css("display", "none");
    }
    jQuery(".bulk-opt-percent", newSlide).html('<input type="text" class="dial" value="' + percent + '"/>');
    
    //debugger;
    jQuery(".bulk-slider").append(newSlide);
    ShortPixel.percentDial("#" + newSlide.attr("id") + " .dial", 100);
    
    jQuery(".bulk-slider-container span.filename").html("&nbsp;&nbsp;" + filename);
    if(oldSlide.attr("id") == "empty-slide") {
        oldSlide.remove();
        jQuery(".bulk-slider-container").css("display", "block");
    } else {
        oldSlide.animate({ left: oldSlide.width() + oldSlide.position().left }, 'slow', 'swing', function(){
            oldSlide.remove();
            newSlide.fadeIn("slow");
        });
    }
}

function hideSlider() {
    jQuery(".bulk-slider-container").css("display", "none");
}

function showStats() {
    var statsDiv = jQuery(".bulk-stats");
    if(statsDiv.length > 0) {
        
    }
}

if (!(typeof String.prototype.format == 'function')) { 
    String.prototype.format = function() {
        var s = this,
            i = arguments.length;

        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };
}
