<?php
/**
 * Visual Composer Skillbar
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'VCEX_Skillbar_Shortcode' ) ) {

	class VCEX_Skillbar_Shortcode {

		/**
		 * Define shortcode name.
		 */
		public $shortcode = 'vcex_skillbar';

		/**
		 * Main constructor.
		 */
		public function __construct() {
			add_shortcode( $this->shortcode, array( $this, 'output' ) );
			add_action( 'vc_after_mapping', array( $this, 'vc_after_mapping' ) );
		}

		/**
		 * Shortcode scripts.
		 */
		public function enqueue_scripts() {
			wp_enqueue_script(
				'appear',
				vcex_asset_url( 'js/lib/jquery.appear.min.js' ),
				array( 'jquery' ),
				'1.0',
				true
			);
		}

		/**
		 * Shortcode output => Get template file and display shortcode.
		 */
		public function output( $atts, $content = null ) {
			ob_start();
			include( vcex_get_shortcode_template( $this->shortcode ) );
			return ob_get_clean();
		}

		/**
		 * VC functions.
		 */
		public function vc_after_mapping() {
			vc_lean_map( $this->shortcode, array( $this, 'map' ) );
		}

		/**
		 * Map shortcode to VC.
		 */
		public function map() {

			// Save re-usable strings
			$s_icon   = esc_html__( 'Icon', 'total-theme-core' );
			$s_design = esc_html__( 'Design', 'total-theme-core' );

			// Return settings array
			return array(
				'name' => esc_html__( 'Skill Bar', 'total-theme-core' ),
				'description' => esc_html__( 'Animated skill bar', 'total-theme-core' ),
				'base' => $this->shortcode,
				'category' => vcex_shortcodes_branding(),
				'icon' => 'vcex-skill-bar vcex-icon ticon ticon-server',
				'params' => array(
					// General
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Text', 'total-theme-core' ),
						'param_name' => 'title',
						'admin_label' => true,
						'value' => 'Web Design',
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Percentage', 'total-theme-core' ),
						'param_name' => 'percentage',
						'value' => 70,
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Unique Id', 'total-theme-core' ),
						'param_name' => 'unique_id',
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Extra class name', 'total-theme-core' ),
						'param_name' => 'classes',
						'description' => esc_html__( 'Style particular content element differently - add a class name and refer to it in custom CSS.', 'total-theme-core' ),
					),
					vcex_vc_map_add_css_animation(),
					array(
						'type' => 'vcex_visibility',
						'heading' => esc_html__( 'Visibility', 'total-theme-core' ),
						'param_name' => 'visibility',
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'true',
						'heading' => esc_html__( 'Display % Number', 'total-theme-core' ),
						'param_name' => 'show_percent',
					),
					// Icon
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Display Icon', 'total-theme-core' ),
						'param_name' => 'show_icon',
						'group' => $s_icon,
					),
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Icon library', 'total-theme-core' ),
						'param_name' => 'icon_type',
						'value' => array(
							esc_html__( 'Font Awesome', 'total-theme-core' ) => 'fontawesome',
							esc_html__( 'Open Iconic', 'total-theme-core' ) => 'openiconic',
							esc_html__( 'Typicons', 'total-theme-core' ) => 'typicons',
							esc_html__( 'Entypo', 'total-theme-core' ) => 'entypo',
							esc_html__( 'Linecons', 'total-theme-core' ) => 'linecons',
							esc_html__( 'Pixel', 'total-theme-core' ) => 'pixelicons',
						),
						'group' => $s_icon,
						'dependency' => array( 'element' => 'show_icon', 'value' => 'true' ),
					),
					array(
						'type' => 'iconpicker',
						'heading' => $s_icon,
						'param_name' => 'icon',
						'settings' => array(
							'emptyIcon' => true,
							'iconsPerPage' => 200,
						),
						'dependency' => array( 'element' => 'icon_type', 'value' => 'fontawesome' ),
						'group' => $s_icon,
					),
					array(
						'type' => 'iconpicker',
						'heading' => $s_icon,
						'param_name' => 'icon_openiconic',
						'settings' => array(
							'emptyIcon' => true,
							'iconsPerPage' => 200,
							'type' => 'openiconic',
						),
						'dependency' => array( 'element' => 'icon_type', 'value' => 'openiconic' ),
						'group' => $s_icon,
					),
					array(
						'type' => 'iconpicker',
						'heading' => $s_icon,
						'param_name' => 'icon_typicons',
						'settings' => array(
							'emptyIcon' => true,
							'iconsPerPage' => 200,
							'type' => 'typicons',
						),
						'dependency' => array( 'element' => 'icon_type', 'value' => 'typicons' ),
						'group' => $s_icon,
					),
					array(
						'type' => 'iconpicker',
						'heading' => $s_icon,
						'param_name' => 'icon_entypo',
						'settings' => array(
							'emptyIcon' => false,
							'type' => 'entypo',
							'iconsPerPage' => 300,
						),
						'dependency' => array( 'element' => 'icon_type', 'value' => 'entypo' ),
						'group' => $s_icon,
					),
					array(
						'type' => 'iconpicker',
						'heading' => $s_icon,
						'param_name' => 'icon_linecons',
						'settings' => array(
							'emptyIcon' => true,
							'iconsPerPage' => 200,
							'type' => 'linecons',
						),
						'dependency' => array( 'element' => 'icon_type', 'value' => 'linecons' ),
						'group' => $s_icon,
					),
					array(
						'type' => 'iconpicker',
						'heading' => $s_icon,
						'param_name' => 'icon_pixelicons',
						'settings' => array(
							'emptyIcon' => true,
							'iconsPerPage' => 200,
							'type' => 'pixelicons',
							'source' => vcex_pixel_icons(),
						),
						'dependency' => array( 'element' => 'icon_type', 'value' => 'pixelicons' ),
						'group' => $s_icon,
					),
					// Design
					array(
						'type' => 'colorpicker',
						'heading' => esc_html__( 'Container Background', 'total-theme-core' ),
						'param_name' => 'background',
						'group' => $s_design,
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'true',
						'heading' => esc_html__( 'Container Inset Shadow', 'total-theme-core' ),
						'param_name' => 'box_shadow',
						'group' => $s_design,
					),
					array(
						'type' => 'colorpicker',
						'heading' => esc_html__( 'Skill Bar Color', 'total-theme-core' ),
						'param_name' => 'color',
						'group' => $s_design,
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Container Height', 'total-theme-core' ),
						'param_name' => 'container_height',
						'group' => $s_design,
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Container Left Padding', 'total-theme-core' ),
						'param_name' => 'container_padding_left',
						'group' => $s_design,
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Font Size', 'total-theme-core' ),
						'param_name' => 'font_size',
						'group' => $s_design,
					),
				)
			);
		}

	}
}
new VCEX_Skillbar_Shortcode;