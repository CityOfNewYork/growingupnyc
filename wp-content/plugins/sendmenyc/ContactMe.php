<?php
namespace SMNYC;

/**
 * Generic parent class for specific contact methods to extend
 *
 * Creates AJAX hooks for you, and automatically includes CSRF protection
 */
class ContactMe {

	/**
	 * For child classes to override. Used in nonce hash and AJAX hook
	 */
	protected $action;

	/**
	 * For child classes to override. Used in settings/option verification.
	 * Must match the keyname used in settings  e.g. smnyc_SERVICE_user
	 */
	protected $service;

	/**
	 * Settings page label hints, and placeholder text
	 */
	protected $account_label;
	protected $secret_label;
	protected $from_label;

	protected $account_hint;
	protected $secret_hint;
	protected $from_hint;


	const RESULTS_PAGE = 1;
	const OTHER_PAGE = 2;

	public function __construct() {
		$this->create_endpoints();
		add_action( 'admin_init', [$this,'create_settings_section'] );
	}

	protected function create_endpoints(){
		// Set up AJAX hooks to each child's ::submission method
		add_action( 'wp_ajax_'.strtolower($this->action).'_send', [$this,'submission']);
		add_action( 'wp_ajax_nopriv_'.strtolower($this->action).'_send', [$this,'submission']);
	}

	public function submission() {
		if ( !isset($_POST["postid"]) || empty($_POST["postid"]) ){
			$this->failure(400, "Post ID required");
		}

		$urltopost = $this->geturl($_POST['postid']);
		if ( !isset($urltopost) || empty($urltopost) ){
			$this->failure(400, "url required");
		}

		if ( !isset($_POST["sharetext"]) || empty($_POST["sharetext"]) ){
			$this->failure(400, "sharetext required");
		}

		$this->validate_nonce( $_POST['hash'], $urltopost );// use nonce for CSRF protection
		
		$this->valid_configuration( strtolower($this->service) ); //make sure credentials are specified
		$recipient = $this->valid_recipient( $_POST['to'] ); // also filters addressee

		$url = $this->shorten($urltopost); // SMS 160 char limit, should shorten URL
		$sharetext = $_POST['sharetext'];
		//results pages have unique email content
		if ( $this->is_results_url( $urltopost ) ) {
			$content = $this->content( $url, self::RESULTS_PAGE , $sharetext );
		} else {
			$content = $this->content( $url, self::OTHER_PAGE , $sharetext );
		}

		$this->send($recipient,$content);
		$this->success();

	}

/**
	 * geturl
	 * creates a bit.ly shortened link to provided url. Fails silently
	 *
	 * @param $id string, The post id to which the url needs to be generated
	 * @return string generated permalink of the post id 
	 */
	private function geturl( $id ) {
		return get_permalink($id);
	}

	/**
	 * shorten
	 * creates a bit.ly shortened link to provided url. Fails silently
	 *
	 * @param $url string, the URL to shorten
	 * @return string  shortened URL on success, original URL on failure
	 */
	private function shorten( $url ) {
		$encoded = urlencode($url);

		$bitly = wp_remote_get("https://api-ssl.bitly.com/v3/shorten?access_token=c9db3f52d253a27979b9fcdadf0fc31b5ed6d969&longUrl=".$encoded);
		if ( is_wp_error($bitly) ) {
			return $url;
		}
		$j = json_decode(wp_remote_retrieve_body($bitly));
		if ( $j->status_code !== 200 ) {
			return $url;
		}

		return $j->data->url;
	}

	/**
	 * validate_nonce
	 * To prevent CSRF attacks, and to otherwise protect an open SMS/Email relay.
	 *
	 * AJAX call should be given a nonce by the webpage, and must submit it back.
	 * We verify it, hashed with the results being saved to make them page-unique
	 */
	protected function validate_nonce( $nonce, $content ) {
		if ( wp_verify_nonce( $nonce, 'bsd_smnyc_token_'.$content ) === false ) {
			$this->failure( 9, 'Invalid request' );
		}
	}

	// Just makes sure that the user, secret key, and from fields were filled out
	protected function valid_configuration( $service ) {
		if ( empty(get_option( 'smnyc_'.$service.'_user' )) || 
		empty(get_option( 'smnyc_'.$service.'_secret' )) || 
		empty(get_option( 'smnyc_'.$service.'_from' )) ){
			$this->failure( -1, 'Invalid Configuration' );
		}
	}

	protected function is_results_url( $url ) {
		$path = parse_url( $_POST["url"], PHP_URL_PATH );
		return preg_match('/.*\/eligibility\/results\/?$/', $path);
	}

	// Helper functions for JSON responses
	protected function respond( $response ) {
		wp_send_json( $response );
		wp_die();
	}
	protected function success() {
		if ( $this->is_results_url($_POST['url']) ){
			do_action( 'results_sent', $this->action, $_POST['to'], (isset($_POST['GUID']) ? $_POST['GUID'] : '0') );
		}
		$this->respond(['success'=>true, 'error'=>NULL, 'message'=>NULL ]);
	}
	protected function failure($code, $message, $retry=false) {
		$this->respond([
			'success'=>false,
			'error'=>$code,
			'message'=>$message,
			'retry'=>$retry,
		]);
	}

	// Settings/Options page things
	public function create_settings_section() {
		$section = 'smnyc_'.strtolower($this->action).'_section';
		$field_prefix = 'smnyc_'.strtolower($this->service);
		$pagename = 'smnyc_config';
		$fieldgroup = 'smnyc_settings';
		add_settings_section( $section, $this->action.' Settings', [$this,'settings_heading_text'], $pagename );
		add_settings_field(
			$field_prefix.'_user',
			$this->account_label,
			[$this,'settings_field_html'],
			$pagename,
			$section,
			[ $field_prefix.'_user', $this->account_hint ]
		);
		add_settings_field(
			$field_prefix.'_secret',
			$this->secret_label,
			[$this,'settings_field_html'],
			$pagename,
			$section,
			[ $field_prefix.'_secret', $this->secret_hint ]
		);
		add_settings_field(
			$field_prefix.'_from',
			$this->from_label,
			[$this,'settings_field_html'],
			$pagename,
			$section,
			[ $field_prefix.'_from', $this->from_hint ]
		);
		register_setting( $fieldgroup, $field_prefix.'_user' );
		register_setting( $fieldgroup, $field_prefix.'_secret' );
		register_setting( $fieldgroup, $field_prefix.'_from' );
	}
	public function settings_heading_text(){
		echo "<p>Enter your ".$this->service." credentials here.</p>";
	}
	public function settings_field_html( $args ){
		echo "<input type='text' name='".$args[0]."' size=40 id='".$args[0]."' value='".get_option( $args[0], '' )."' placeholder='".$args[1]."' />";
	}
}