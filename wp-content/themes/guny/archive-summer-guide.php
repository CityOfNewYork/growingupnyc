<?php

/**
 * Archive for Summer Guides (landing page, list view)
 */

$context = Timber::get_context();

$context['page_title'] = SummerGuides\get_title();
$context['page_tagline'] = SummerGuides\get_tagline();
$context['banner'] = SummerGuides\get_hero_banner_img();
$context['filters'] = SummerGuides\get_filters();

Timber::render(array('list-summer-guide.twig'), $context);
