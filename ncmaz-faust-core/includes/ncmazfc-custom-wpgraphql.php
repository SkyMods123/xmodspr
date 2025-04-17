<?php

// CUSTOM  https://www.wpgraphql.com/recipes/

// =====================    Remove Extensions from GraphQL Response     ==============================
// add_filter('graphql_request_results', function ($response) {
//     if (is_array($response) && isset($response['extensions'])) {
//         unset($response['extensions']);
//     }
//     if (is_object($response) && isset($response->extensions)) {
//         unset($response->extensions);
//     }
//     return $response;
// }, 99, 1);



// MAKE ALL AUTHOR IS PUBLIC
add_filter('graphql_connection_query_args', function ($query_args, $connection_resolver) {
    if ($connection_resolver instanceof \WPGraphQL\Data\Connection\UserConnectionResolver) {
        unset($query_args['has_published_posts']);
    }
    return $query_args;
}, 10, 2);

add_filter('graphql_object_visibility', function ($visibility, $model_name, $data, $owner, $current_user) {
    // only apply our adjustments to the UserObject Model
    if ('UserObject' === $model_name) {
        $visibility = 'public';
    }
    return $visibility;
}, 10, 5);

// Dodavanje checkbox-a za "Verified" u korisnički profil
add_action('show_user_profile', 'add_verified_checkbox_to_user_profile');
add_action('edit_user_profile', 'add_verified_checkbox_to_user_profile');

function add_verified_checkbox_to_user_profile($user) {
    // Dohvatanje trenutne vrednosti "is_verified"
    $is_verified = get_user_meta($user->ID, 'is_verified', true);
    ?>
    <h3><?php esc_html_e('Verification', 'your-text-domain'); ?></h3>
    <table class="form-table">
        <tr>
            <th><label for="is_verified"><?php esc_html_e('Verified User', 'your-text-domain'); ?></label></th>
            <td>
                <input type="checkbox" name="is_verified" id="is_verified" value="1" <?php checked($is_verified, '1'); ?> />
                <span class="description"><?php esc_html_e('Check this box if the user is verified.', 'your-text-domain'); ?></span>
            </td>
        </tr>
    </table>
    <?php
}

// Čuvanje vrednosti checkbox-a kada se korisnički profil sačuva
add_action('personal_options_update', 'save_verified_checkbox');
add_action('edit_user_profile_update', 'save_verified_checkbox');

function save_verified_checkbox($user_id) {
    // Provera da li korisnik ima dozvolu za izmene
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }

    // Ažuriranje "is_verified" meta podatka
    if (isset($_POST['is_verified'])) {
        update_user_meta($user_id, 'is_verified', '1');
    } else {
        delete_user_meta($user_id, 'is_verified');
    }
}