<?php
/**
 * Title Push Up Overlay
 *
 * @package Total WordPress Theme
 * @subpackage Partials
 * @version 3.9
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
$title = isset( $args['post_title'] ) ? $args['post_title'] : get_the_title(); ?>

<div class="overlay-title-push-up theme-overlay"><span class="title"><?php echo esc_html( $title ); ?></span></div>