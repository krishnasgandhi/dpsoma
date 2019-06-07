<?php
/**
 * Number VC param
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function vcex_number_shortcode_param( $settings, $value ) {

	$value = $value ? floatval( $value ) : '';
	$min   = isset( $settings['min'] ) ? $settings['min'] : '1';
	$max   = isset( $settings['max'] ) ? $settings['max'] : '100';
	$step  = isset( $settings['step'] ) ? $settings['step'] : '1';

	$output = '<input';

		$output .= ' name="'. esc_attr( $settings['param_name'] ) .'"';

		$output .= ' class="wpb_vc_param_value wpb-input wpb-select ' . esc_attr( $settings['param_name'] ) . ' ' . esc_attr( $settings['type'] ) . '_field"';

		$output .= 'type="number"';

		$output .= 'value="' . esc_attr( $value ) . '"';

		$output .= 'min="' . esc_attr( $min ). '"';

		$output .= 'max="' . esc_attr( $max ) . '"';

		$output .= 'step="' . esc_attr( $step ) . '"';

	$output .= '>';

	return $output;

}

vc_add_shortcode_param(
	'vcex_number',
	'vcex_number_shortcode_param'
);