<?php

namespace WPGraphQL\Mutation;

use GraphQL\Error\UserError;
use GraphQLRelay\Relay;
use WPGraphQL\Model\Comment;
use WPGraphQL\Utils\Utils;

add_action('graphql_register_types', function () {
    register_graphql_field('User', 'isVerified', [
        'type' => 'Boolean',
        'description' => __('Indicates whether the user is verified or not', 'your-text-domain'),
        'resolve' => function ($user) {
            // Dohvatanje prilagođenog polja "is_verified" za korisnika
            $is_verified = get_user_meta($user->userId, 'is_verified', true);
            return filter_var($is_verified, FILTER_VALIDATE_BOOLEAN); // Vraća true ili false
        }
    ]);
});