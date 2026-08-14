<?php

return [
    'demo_mode' => (bool) env('URBANPULSE_DEMO_MODE', true),
    // Seeding is opt-in so production cannot receive demo records merely
    // because an environment variable was omitted.
    'seed_demo' => (bool) env('URBANPULSE_SEED_DEMO', false),
    'default_region_code' => env('URBANPULSE_DEFAULT_REGION_CODE', 'urbanpulse-demo-city'),

    // Protective starting limits for the single-city demo. They remain
    // environment-configurable until traffic and abuse tests provide evidence.
    'rate_limits' => [
        'public_read' => (int) env('URBANPULSE_RATE_PUBLIC_READ', 120),
        'report_create' => (int) env('URBANPULSE_RATE_REPORT_CREATE', 5),
        'report_confirm' => (int) env('URBANPULSE_RATE_REPORT_CONFIRM', 20),
        'report_status_update' => (int) env('URBANPULSE_RATE_REPORT_STATUS_UPDATE', 60),
        'tracking_lookup' => (int) env('URBANPULSE_RATE_TRACKING_LOOKUP', 10),
        'authentication' => (int) env('URBANPULSE_RATE_AUTHENTICATION', 5),
        'registration_per_hour' => (int) env('URBANPULSE_RATE_REGISTRATION_PER_HOUR', 5),
    ],
];
