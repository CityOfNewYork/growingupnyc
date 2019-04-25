<?php

class WPML_TM_Jobs_List_Translators {
	/** @var WPML_Translator_Records */
	private $translator_records;

	/**
	 * @param WPML_Translator_Records $translator_records
	 */
	public function __construct( WPML_Translator_Records $translator_records ) {
		$this->translator_records = $translator_records;
	}


	public function get() {
		$translators = $this->translator_records->get_users_with_capability();

		return array_map( array( $this, 'map' ), $translators );
	}

	private function map( $translator ) {
		$language_codes = array_flip( icl_get_languages_codes() );
		$new_pairs      = array();
		foreach ( $translator->language_pairs as $source => $targets ) {
			foreach ( $targets as $target ) {
				$source_language = isset( $language_codes[ $source ] ) ? $language_codes[ $source ] : '';
				$target_language = isset( $language_codes[ $target ] ) ? $language_codes[ $target ] : '';
				$new_pair        = array(
					'source' => $source_language,
					'target' => $target_language,
				);
				$new_pairs[]     = $new_pair;
			}
		};
		$translator->language_pairs = $new_pairs;

		return array(
			'value'         => $translator->ID,
			'label'         => $translator->display_name,
			'languagePairs' => $translator->language_pairs,
		);
	}
}
