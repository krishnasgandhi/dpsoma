<?php
/**
 * Button Colors Select Param
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function vcex_button_colors_shortcode_param( $settings, $value ) {

	if ( function_exists( 'wpex_get_accent_colors' ) ) {

		$output = '<div class="vcex-colors-select-param vcex-custom-select clr">';

		$colors = ( array ) wpex_get_accent_colors();

		foreach ( $colors as $color_id => $color_opts ) {

			$color_id = ( $color_id == 'default' ) ? '' : $color_id;
			$active = ( $color_id == $value ) ? ' vcex-active' : '';

			if ( $color_id ) {
				$style = 'background-color:' . esc_attr( $color_opts['hex'] ) . '';
				$output .= '<div class="vcex-opt' . $active . '" data-value="'. esc_attr( $color_id )  .'" style="'. $style .'"></div>';
			} else {
				$output .= '<div class="vcex-opt vcex-default' . $active . '" data-value="'. esc_attr( $color_id )  .'"><span class="ticon ticon-times"></span></div>';
			}

		}

		$output .= '<input name="' . $settings['param_name'] . '" class="vcex-hidden-input wpb-input wpb_vc_param_value  ' . $settings['param_name'] . ' ' . $settings['type'] . '_field" type="hidden" value="' . esc_attr( $value ) . '" />';

		$output .= '</div>';

	} else {
		$output = vcex_total_exclusive_notice();
		$output .= '<input type="hidden" class="wpb_vc_param_value '
				. esc_attr( $settings['param_name'] ) . ' '
				. esc_attr( $settings['type'] ) . '" name="' . esc_attr( $settings['param_name'] ) . '" value="' . esc_attr( $value ) . '"/>';
	}

	return $output;

}
vc_add_shortcode_param(
	'vcex_button_colors',
	'vcex_button_colors_shortcode_param',
	vcex_asset_url( 'js/backend/vcex-params.min.js?v=4.9' )
);