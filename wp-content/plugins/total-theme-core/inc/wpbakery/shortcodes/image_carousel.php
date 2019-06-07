<?php
/**
 * Visual Composer Image Carousel
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'VCEX_Image_Carousel' ) ) {

	class VCEX_Image_Carousel {

		/**
		 * Define shortcode name.
		 */
		public $shortcode = 'vcex_image_carousel';

		/**
		 * Main constructor.
		 */
		public function __construct() {
			add_shortcode( $this->shortcode, array( $this, 'output' ) );
			add_action( 'vc_after_mapping', array( $this, 'vc_after_mapping' ) );
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
			add_filter( 'vc_edit_form_fields_attributes_' . $this->shortcode, 'vcex_parse_deprecated_grid_entry_content_css' );
			//add_filter( 'vc_edit_form_fields_attributes_' . $this->shortcode, 'vcex_parse_image_size' );
		}

		/**
		 * Map shortcode to VC.
		 */
		public function map() {
			$settings = array(
				'name' => esc_html__( 'Image Carousel', 'total-theme-core' ),
				'description' => esc_html__( 'Image based jQuery carousel', 'total-theme-core' ),
				'base' => $this->shortcode,
				'category' => vcex_shortcodes_branding(),
				'icon' => 'vcex-image-carousel vcex-icon ticon ticon-picture-o',
				'params' => array(
					// Gallery
					array(
						'type' => 'vcex_attach_images',
						'heading'  => esc_html__( 'Images', 'total-theme-core' ),
						'param_name' => 'image_ids',
						'group' => esc_html__( 'Gallery', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'admin_label' => true,
						'std' => 'false',
						'heading'  => esc_html__( 'Post Gallery', 'total-theme-core' ),
						'param_name' => 'post_gallery',
						'group' => esc_html__( 'Gallery', 'total-theme-core' ),
						'description' => esc_html__( 'Enable to display images from the current post "Image Gallery".', 'total-theme-core' ),
					),
					array(
						'type'        => 'textfield',
						'heading'     => esc_html__( 'Custom Field Name', 'total-theme-core' ),
						'param_name'  => 'custom_field_gallery',
						'group'       => esc_html__( 'Gallery', 'total-theme-core' ),
						'description' => esc_html__( 'Enter the name of an Advanced Custom Field gallery or other meta field that returns an array of attachment ID\'s or a comma separated string to pull images from.', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading'  => esc_html__( 'Randomize Images', 'total-theme-core' ),
						'param_name' => 'randomize_images',
						'group' => esc_html__( 'Gallery', 'total-theme-core' ),
					),
					// General
					array(
						'type' => 'textfield',
						'heading'  => esc_html__( 'Unique Id', 'total-theme-core' ),
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
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Style', 'total-theme-core' ),
						'param_name' => 'style',
						'std' => 'default',
						'choices' => array(
							'default' => esc_html__( 'Default', 'total-theme-core' ),
							'no-margins' => esc_html__( 'No Margins', 'total-theme-core' ),
						),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Animation Speed', 'total-theme-core' ),
						'param_name' => 'animation_speed',
						'value' => '150',
						'description' => esc_html__( 'Default is 150 milliseconds. Enter 0.0 to disable.', 'total-theme-core' ),
					),
					// Image
					array(
						'type' => 'vcex_image_sizes',
						'heading' => esc_html__( 'Image Size', 'total-theme-core' ),
						'param_name' => 'img_size',
						'std' => 'wpex_custom',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_image_crop_locations',
						'heading' => esc_html__( 'Image Crop Location', 'total-theme-core' ),
						'param_name' => 'img_crop',
						'std' => 'center-center',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Image Crop Width', 'total-theme-core' ),
						'param_name' => 'img_width',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Image Crop Height', 'total-theme-core' ),
						'param_name' => 'img_height',
						'description' => esc_html__( 'Enter a height in pixels. Leave empty to disable vertical cropping and keep image proportions.', 'total-theme-core' ),
						'group' => esc_html__( 'Image', 'total-theme-core' ),
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'no',
						'vcex' => array(
							'on' => 'yes',
							'off' => 'no',
						),
						'heading' => esc_html__( 'Rounded Image?', 'total-theme-core' ),
						'param_name' => 'rounded_image',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_overlay',
						'heading' => esc_html__( 'Image Overlay', 'total-theme-core' ),
						'param_name' => 'overlay_style',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Overlay Button Text', 'total-theme-core' ),
						'param_name' => 'overlay_button_text',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
						'dependency' => array( 'element' => 'overlay_style', 'value' => 'hover-button' ),
					),
					array(
						'type' => 'vcex_image_hovers',
						'heading' => esc_html__( 'CSS3 Image Hover', 'total-theme-core' ),
						'param_name' => 'img_hover_style',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_image_filters',
						'heading' => esc_html__( 'Image Filter', 'total-theme-core' ),
						'param_name' => 'img_filter',
						'group' => esc_html__( 'Image', 'total-theme-core' ),
					),
					// Links
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Image Link', 'total-theme-core' ),
						'param_name' => 'thumbnail_link',
						'std' => 'none',
						'choices' => array(
							'none' => esc_html__( 'None', 'total-theme-core' ),
							'lightbox' => esc_html__( 'Lightbox', 'total-theme-core' ),
							'full_image' => esc_html__( 'Full Image', 'total-theme-core' ),
							'attachment_page' => esc_html__( 'Attachment Page', 'total-theme-core' ),
							'custom_link' => esc_html__( 'Custom Links', 'total-theme-core' ),
						),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
					),
					array(
						'type' => 'exploded_textarea',
						'heading'  => esc_html__( 'Custom links', 'total-theme-core' ),
						'param_name' => 'custom_links',
						'description' => esc_html__( 'Enter links for each slide here. Divide links with linebreaks (Enter). For images without a link enter a # symbol. And don\'t forget to include the http:// at the front.', 'total-theme-core'),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => 'custom_link' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading'  => esc_html__( 'Target', 'total-theme-core' ),
						'param_name' => 'custom_links_target',
						'group' => esc_html__( 'Links', 'total-theme-core' ),
						'choices' => 'link_target',
						'dependency' => array(
							'element' => 'thumbnail_link',
							'value' => array( 'custom_link', 'attachment_page', 'full_image' )
						),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Lightbox Thumbnails Placement', 'total-theme-core' ),
						'param_name' => 'lightbox_path',
						'std' => 'horizontal',
						'choices' => array(
							'horizontal' => esc_html__( 'Horizontal', 'total-theme-core' ),
							'vertical' => esc_html__( 'Vertical', 'total-theme-core' ),
						),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => 'lightbox' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Lightbox Title', 'total-theme-core' ),
						'param_name' => 'lightbox_title',
						'std' => 'none',
						'choices' => array(
							'none' => esc_html__( 'None', 'total-theme-core' ),
							'alt' => esc_html__( 'Alt', 'total-theme-core' ),
							'title' => esc_html__( 'Title', 'total-theme-core' ),
						),
						'group' => esc_html__( 'Links', 'total-theme-core' ),
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => 'lightbox' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'true',
						'heading' => esc_html__( 'Lightbox Caption', 'total-theme-core' ),
						'param_name' => 'lightbox_caption',
						'group' => esc_html__( 'Links', 'total-theme-core' ),
						'dependency' => array( 'element' => 'thumbnail_link', 'value' => 'lightbox' ),
					),
					// Title
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'no',
						'vcex' => array(
							'on' => 'yes',
							'off' => 'no',
						),
						'heading' => esc_html__( 'Title', 'total-theme-core' ),
						'param_name' => 'title',
						'group' => esc_html__( 'Title', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_select_buttons',
						'heading' => esc_html__( 'Title Based On Image', 'total-theme-core' ),
						'param_name' => 'title_type',
						'std' => 'title',
						'choices' => array(
							'title' => esc_html__( 'Title', 'total-theme-core' ),
							'alt' => esc_html__( 'Alt', 'total-theme-core' ),
						),
						'group' => esc_html__( 'Title', 'total-theme-core' ),
						'dependency' => array( 'element' => 'title', 'value' => 'yes' ),
					),
					array(
						'type' => 'colorpicker',
						'heading' => esc_html__( 'Color', 'total-theme-core' ),
						'param_name' => 'content_heading_color',
						'group' => esc_html__( 'Title', 'total-theme-core' ),
						'dependency' => array( 'element' => 'title', 'value' => 'yes' ),
					),
					array(
						'type' => 'vcex_font_weight',
						'heading' => esc_html__( 'Font Weight', 'total-theme-core' ),
						'param_name' => 'content_heading_weight',
						'group' => esc_html__( 'Title', 'total-theme-core' ),
						'dependency' => array( 'element' => 'title', 'value' => 'yes' ),
					),
					array(
						'type' => 'vcex_text_transforms',
						'heading' => esc_html__( 'Text Transform', 'total-theme-core' ),
						'param_name' => 'content_heading_transform',
						'group' => esc_html__( 'Title', 'total-theme-core' ),
						'dependency' => array( 'element' => 'title', 'value' => 'yes' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Font Size', 'total-theme-core' ),
						'param_name' => 'content_heading_size',
						'dependency' => array( 'element' => 'title', 'value' => 'yes' ),
						'group' => esc_html__( 'Title', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Margin', 'total-theme-core' ),
						'param_name' => 'content_heading_margin',
						'description' => esc_html__( 'Please use the following format: top right bottom left.', 'total-theme-core' ),
						'dependency' => array( 'element' => 'title', 'value' => 'yes' ),
					),
					// Caption
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'no',
						'vcex' => array(
							'on' => 'yes',
							'off' => 'no',
						),
						'heading' => esc_html__( 'Display Caption', 'total-theme-core' ),
						'param_name' => 'caption',
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
					),
					array(
						'type' => 'colorpicker',
						'heading' => esc_html__( 'Color', 'total-theme-core' ),
						'param_name' => 'content_color',
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
						'dependency' => array( 'element' => 'caption', 'value' => 'yes' ),
					),
					array(
						'type' => 'textfield',
						'heading'  => esc_html__( 'Font Size', 'total-theme-core' ),
						'param_name' => 'content_font_size',
						'group' => esc_html__( 'Caption', 'total-theme-core' ),
						'dependency' => array( 'element' => 'caption', 'value' => 'yes' ),
					),
					// Design
					array(
						'type' => 'css_editor',
						'heading' => esc_html__( 'Content CSS', 'total-theme-core' ),
						'param_name' => 'content_css',
						'group' => esc_html__( 'Content CSS', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_text_alignments',
						'heading' => esc_html__( 'Content Alignment', 'total-theme-core' ),
						'param_name' => 'content_alignment',
						'group' => esc_html__( 'Content CSS', 'total-theme-core' ),
						'std' => '',
					),
					// Entry CSS
					array(
						'type' => 'css_editor',
						'heading' => esc_html__( 'Entry CSS', 'total-theme-core' ),
						'param_name' => 'entry_css',
						'group' => esc_html__( 'Entry CSS', 'total-theme-core' ),
					),
				),
			);

			$settings[ 'params' ] = array_merge( $settings[ 'params' ], vcex_vc_map_carousel_settings() );

			return $settings;

		}

	}
}
new VCEX_Image_Carousel;