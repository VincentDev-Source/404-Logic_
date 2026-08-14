<?php

return [
    'version' => 'city-score-v0-demo',
    'minimum_category_coverage' => 0.70,
    'minimum_overall_coverage' => 0.80,

    'category_weights' => [
        'environment' => 0.25,
        'mobility' => 0.20,
        'infrastructure' => 0.20,
        'public_services' => 0.20,
        'community' => 0.15,
    ],

    // Metric boundaries remain empty until an official standard, city SLA,
    // or documented historical baseline has been approved for each metric.
    'metric_rules' => [],
];
