<?php
/**
 * Portfolio single media template part
 *
 * @package Total WordPress theme
 * @subpackage Partials
 * @version 4.9
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get attachments ( gallery images )
$attachments = wpex_get_gallery_ids( get_the_ID() );  ?>

<div id="portfolio-single-media" class="wpex-clr">

	<?php
	// Display slider if there are $attachments
	if ( $attachments ) :

		get_template_part( 'partials/portfolio/portfolio-single-gallery' );

	// Display Post Video if defined
	elseif ( $video = wpex_get_post_video() ) : ?>

		<?php echo wpex_get_portfolio_post_video( $video ); ?>

	<?php
	// Otherwise display post thumbnail
	elseif ( has_post_thumbnail() ) : ?>

		<?php if ( apply_filters( 'wpex_single_portfolio_media_lightbox', true ) ) :

			// Load lightbox styles
			wpex_enqueue_ilightbox_skin(); ?>

			<a href="<?php wpex_lightbox_image(); ?>" title="<?php wpex_esc_title(); ?>" class="wpex-lightbox" data-show_title="false"><?php echo wpex_get_portfolio_post_thumbnail(); ?></a>

		<?php else : ?>

			<?php echo wpex_get_portfolio_post_thumbnail(); ?>

		<?php endif; ?>

	<?php endif; ?>

</div><!-- .portfolio-entry-media -->