<?php
/**
 * Icon Font Family VC param
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function vcex_icon_font_family_shortcode_param( $settings, $value ) {

	// Begin output
	$output = '<select name="'
			. $settings['param_name']
			. '" class="wpb_vc_param_value wpb-input wpb-select '
			. $settings['param_name']
			. ' ' . $settings['type'] .'">';

	// Define options
	$options = apply_filters( 'vcex_icon_font_family_options', array(
		''            => esc_html__( 'None', 'total-theme-core' ),
		'fontawesome' => esc_html__( 'Font Awesome', 'total-theme-core' ),
		'openiconic'  => esc_html__( 'Open Iconic', 'total-theme-core' ),
		'typicons'    => esc_html__( 'Typicons', 'total-theme-core' ),
		'entypo'      => esc_html__( 'Entypo', 'total-theme-core' ),
		'linecons'    =>__( 'Linecons', 'total-theme-core' ),
	) );

	// Loop through options
	foreach ( $options as $key => $name ) {

		$output .= '<option value="' . esc_attr( $key )  . '" ' . selected( $value, $key, false ) . '>' . esc_attr( $name ) . '</option>';

	}

	$output .= '</select>';

	// Return output
	return $output;

}

vc_add_shortcode_param(
	'vcex_icon_font_family',
	'vcex_icon_font_family_shortcode_param'
);