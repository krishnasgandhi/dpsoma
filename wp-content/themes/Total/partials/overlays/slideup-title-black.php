<?php
/**
 * Slide Up Title Black Overlay
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
} ?>

<div class="overlay-slideup-title overlay-hide black clr theme-overlay">
	<span class="title">
		<?php if ( 'staff' == get_post_type() ) {
			echo esc_html( get_post_meta( get_the_ID(), 'wpex_staff_position', true ) );
		} else {
			$title = isset( $args['post_title'] ) ? $args['post_title'] : get_the_title();
			echo esc_html( $title );
		} ?>
	</span>
</div>