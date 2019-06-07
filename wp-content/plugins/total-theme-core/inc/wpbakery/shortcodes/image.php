<?php
/**
 * Visual Composer Image Module
 *
 * @package Total Theme Core
 * @subpackage WPBakery
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'VCEX_Image_Shortcode' ) ) {

	class VCEX_Image_Shortcode {

		/**
		 * Define shortcode name.
		 */
		public $shortcode = 'vcex_image';

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
		}

		/**
		 * Map shortcode to VC
		 *
		 * @since 4.5
		 */
		public function map() {
			return array(
				'name' => esc_html__( 'Image', 'total-theme-core' ),
				'description' => esc_html__( 'Single Image', 'total-theme-core' ),
				'base' => $this->shortcode,
				'icon' => 'vcex-image-banner vcex-icon ticon ticon-picture-o',
				'category' => vcex_shortcodes_branding(),
				'params' => array(
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Source', 'total-theme-core' ),
						'param_name' => 'source',
						'std' => 'media_library',
						'value' => array(
							esc_html__( 'Media Library', 'total-theme-core' ) => 'media_library',
							esc_html__( 'External', 'total-theme-core' ) => 'external',
							esc_html__( 'Custom Field', 'total-theme-core' ) => 'custom_field',
							esc_html__( 'Featured Image', 'total-theme-core' ) => 'featured',
							esc_html__( 'Post Author Avatar', 'total-theme-core' ) => 'author_avatar',
							esc_html__( 'Current User Avatar', 'total-theme-core' ) => 'user_avatar',
						),
					),
					array(
						'type' => 'attach_image',
						'heading' => esc_html__( 'Image', 'total-theme-core' ),
						'param_name' => 'image_id',
						'dependency' => array( 'element' => 'source', 'value' => 'media_library' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'External Image URL', 'total-theme-core' ),
						'param_name' => 'external_image',
						'dependency' => array( 'element' => 'source', 'value' => 'external' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Custom Field Name', 'total-theme-core' ),
						'param_name' => 'custom_field_name',
						'dependency' => array( 'element' => 'source', 'value' => 'custom_field' ),
					),
					array(
						'type' => 'vc_link',
						'heading' => esc_html__( 'Link', 'total-theme-core' ),
						'param_name' => 'link',
						'dependency' => array( 'element' => 'lightbox', 'value' => 'false' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Alt Attribute', 'total-theme-core' ),
						'param_name' => 'alt_attr',
					),
					array(
						'type' => 'vcex_ofswitch',
						'heading' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'param_name' => 'lightbox',
						'std' => 'false',
					),
					array(
						'type' => 'vcex_text_alignments',
						'heading' => esc_html__( 'Align', 'total-theme-core' ),
						'param_name' => 'align',
						'std' => '',
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Width', 'total-theme-core' ),
						'param_name' => 'width',
						'std' => '',
						'description' => esc_html__( 'The width function can be used to constrict your image to a specific width without having to crop the image. It also can be used in combination with different overlay styles that require the image to stretch to fit the parent container', 'total-theme-core' )
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Border Radius', 'total-theme-core' ),
						'param_name' => 'border_radius',
						'std' => '',
					),
					array(
						'type' => 'vcex_visibility',
						'heading' => esc_html__( 'Visibility', 'total-theme-core' ),
						'param_name' => 'visibility',
					),
					vcex_vc_map_add_css_animation(),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Extra class name', 'total-theme-core' ),
						'param_name' => 'el_class',
						'description' => esc_html__( 'Style particular content element differently - add a class name and refer to it in custom CSS.', 'total-theme-core' ),
					),
					// Crop
					array(
						'type' => 'vcex_notice',
						'param_name' => 'main_notice',
						'text' => esc_html__( 'For security reasons cropping only works on images hosted on your own server in the WordPress uploads folder. If you are using an external image it will display in full.', 'total-theme-core' ),
						'group' => esc_html__( 'Size', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_image_sizes',
						'heading' => esc_html__( 'Image Size', 'total-theme-core' ),
						'param_name' => 'img_size',
						'std' => 'wpex_custom',
						'group' => esc_html__( 'Size', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_image_crop_locations',
						'heading' => esc_html__( 'Image Crop Location', 'total-theme-core' ),
						'param_name' => 'img_crop',
						'std' => 'center-center',
						'group' => esc_html__( 'Size', 'total-theme-core' ),
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Image Crop Width', 'total-theme-core' ),
						'param_name' => 'img_width',
						'group' => esc_html__( 'Size', 'total-theme-core' ),
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Image Crop Height', 'total-theme-core' ),
						'param_name' => 'img_height',
						'description' => esc_html__( 'Enter a height in pixels. Leave empty to disable vertical cropping and keep image proportions.', 'total-theme-core' ),
						'group' => esc_html__( 'Size', 'total-theme-core' ),
						'dependency' => array( 'element' => 'img_size', 'value' => 'wpex_custom' ),
					),
					// Lightbox
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Custom Lightbox URL', 'total-theme-core' ),
						'param_name' => 'lightbox_url',
						'group' => esc_html__( 'lightbox', 'total-theme-core' ),
						'dependency' => array( 'element' => 'lightbox', 'value' => 'true' ),
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
					),
					array(
						'type' => 'dropdown',
						'heading' => esc_html__( 'Lightbox Type', 'total-theme-core' ),
						'param_name' => 'lightbox_type',
						'std' => 'video',
						'value' => array(
							esc_html__( 'Youtube, Vimeo, Embed or Iframe', 'total-theme-core' ) => 'video',
							esc_html__( 'Image', 'total-theme-core' ) => 'image',
							esc_html__( 'URL', 'total-theme-core' ) => 'url',
							esc_html__( 'HTML5', 'total-theme-core' ) => 'html5',
							esc_html__( 'Quicktime', 'total-theme-core' ) => 'quicktime',
						),
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'dependency' => array( 'element' => 'lightbox_url', 'not_empty' => true ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'heading' => esc_html__( 'Video Overlay Icon?', 'total-theme-core' ),
						'param_name' => 'lightbox_video_overlay_icon',
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'std' => 'false',
						'dependency' => array( 'element' => 'lightbox_type', 'value' => 'video' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Lightbox Title', 'total-theme-core' ),
						'param_name' => 'lightbox_title',
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'dependency' => array( 'element' => 'lightbox', 'value' => 'true' ),
					),
					array(
						'type' => 'textarea',
						'heading' => esc_html__( 'Lightbox Caption', 'total-theme-core' ),
						'param_name' => 'lightbox_caption',
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'dependency' => array( 'element' => 'lightbox', 'value' => 'true' ),
						'description' => esc_html__( 'The lightbox caption can be used to add a longer caption to your image lighbox. This setting is exclusive for singular images.', 'total-theme-core' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Lightbox Dimensions', 'total-theme-core' ),
						'param_name' => 'lightbox_dimensions',
						'description' => esc_html__( 'Enter a custom width and height for your lightbox pop-up window. Use format widthxheight. Example: 900x600.', 'total-theme-core' ),
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'dependency' => array( 'element' => 'lightbox_type', 'value' => array( 'video', 'url', 'html5', 'quicktime' ) ),
					),
					array(
						'type' => 'attach_image',
						'admin_label' => false,
						'heading' => esc_html__( 'Custom Image', 'total-theme-core' ),
						'param_name' => 'lightbox_custom_img',
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'dependency' => array( 'element' => 'lightbox', 'value' => 'true' ),
					),
					array(
						'type' => 'vcex_attach_images',
						'admin_label' => false,
						'heading' => esc_html__( 'Custom Gallery', 'total-theme-core' ),
						'param_name' => 'lightbox_gallery',
						'description' => esc_html__( 'Select images to create a lightbox Gallery.', 'total-theme-core' ),
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'dependency' => array( 'element' => 'lightbox', 'value' => 'true' ),
					),
					array(
						'type' => 'vcex_ofswitch',
						'std' => 'false',
						'heading' => esc_html__( 'Post Gallery', 'total-theme-core' ),
						'param_name' => 'lightbox_post_gallery',
						'group' => esc_html__( 'Lightbox', 'total-theme-core' ),
						'dependency' => array( 'element' => 'lightbox', 'value' => 'true' ),
					),
					// Custom CSS
					array(
						'type' => 'css_editor',
						'heading' => esc_html__( 'Design Options', 'total-theme-core' ),
						'param_name' => 'css',
						'group' => esc_html__( 'Design Options', 'total-theme-core' ),
					),
					// Overlay and Hover
					array(
						'type' => 'vcex_hover_animations',
						'heading' => esc_html__( 'Hover Animation', 'total-theme-core'),
						'param_name' => 'hover_animation',
						'group' => esc_html__( 'Other', 'total-theme-core' ),
					),
					array(
						'type' => 'vcex_overlay',
						'heading' => esc_html__( 'Image Overlay', 'total-theme-core' ),
						'param_name' => 'overlay_style',
						'std' => 'none',
						'group' => esc_html__( 'Other', 'total-theme-core' ),
						'exclude_choices' => array( 'thumb-swap', 'category-tag', 'category-tag-two' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Overlay Excerpt Length', 'total-theme-core' ),
						'param_name' => 'overlay_excerpt_length',
						'value' => '15',
						'group' => esc_html__( 'Other', 'total-theme-core' ),
						'dependency' => array( 'element' => 'overlay_style', 'value' => 'title-excerpt-hover' ),
					),
					array(
						'type' => 'textfield',
						'heading' => esc_html__( 'Overlay Button Text', 'total-theme-core' ),
						'param_name' => 'overlay_button_text',
						'group' => esc_html__( 'Other', 'total-theme-core' ),
						'dependency' => array( 'element' => 'overlay_style', 'value' => 'hover-button' ),
					),
					array(
						'type' => 'vcex_image_hovers',
						'heading' => esc_html__( 'CSS3 Image Hover', 'total-theme-core' ),
						'param_name' => 'img_hover_style',
						'group' => esc_html__( 'Other', 'total-theme-core' ),
						'dependency' => array( 'element' => 'hover_animation', 'is_empty' => true ),
					),
					array(
						'type' => 'vcex_image_filters',
						'heading' => esc_html__( 'Image Filter', 'total-theme-core' ),
						'param_name' => 'img_filter',
						'group' => esc_html__( 'Other', 'total-theme-core' ),
					),
				)
			);
		}

	}
}
new VCEX_Image_Shortcode;