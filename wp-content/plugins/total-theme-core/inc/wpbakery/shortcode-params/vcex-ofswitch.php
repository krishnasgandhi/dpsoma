<?php
/**
 * Font Weight VC param
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function vcex_ofswitch_shortcode_param( $settings, $value ) {

	$on  = 'true';
	$off = 'false';

	if ( isset( $settings['vcex'] ) ) {
		$on  = $settings['vcex']['on'];
		$off = $settings['vcex']['off'];
	}

	$output = '<div class="vcex-ofswitch vcex-noselect">';

		$active = $value == $on ? ' vcex-active' : '';

		$output .= '<div class="vcex-btn vcex-on' . $active . '" data-value="' . $on . '">on</div>';

		$active = $value == $off ? ' vcex-active' : '';

		$output .= '<div class="vcex-btn vcex-off' . $active . '" data-value="' . $off . '">off</div>';

		$output .= '<input name="' . esc_attr( $settings['param_name'] ) . '" class="vcex-hidden-input wpb-input wpb_vc_param_value  ' . esc_attr( $settings['param_name'] ) . ' ' . esc_attr( $settings['type'] ) . '_field" type="hidden" value="' . esc_attr( $value ) . '" />';

	$output .= '</div>';

	return $output;

}

vc_add_shortcode_param(
	'vcex_ofswitch',
	'vcex_ofswitch_shortcode_param',
	vcex_asset_url( 'js/backend/vcex-params.min.js?v=4.9' )
);