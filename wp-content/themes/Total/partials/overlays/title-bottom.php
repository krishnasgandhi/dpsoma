<?php
/**
 * Title Push Up Overlay
 *
 * @package Total WordPress Theme
 * @subpackage Partials
 * @version 4.9
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Only used for inside position
if ( 'inside_link' != $position ) {
	return;
}

// Get post data
$title = isset( $args['post_title'] ) ? $args['post_title'] : get_the_title();

// Title is required
if ( ! $title ) {
	return;
} ?>

<div class="overlay-title-bottom theme-overlay textcenter"><span class="title"><?php echo esc_html( $title ); ?></span></div>