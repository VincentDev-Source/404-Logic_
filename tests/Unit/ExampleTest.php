<?php

namespace Tests\Unit;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_city_score_and_priority_weights_are_complete(): void
    {
        $scoreWeights = config('city_score.category_weights');
        $priorityWeights = config('city_priority.factor_weights');

        $this->assertEqualsWithDelta(1.0, array_sum($scoreWeights), 0.00001);
        $this->assertEqualsWithDelta(1.0, array_sum($priorityWeights), 0.00001);
        $this->assertSame('city-score-v0-demo', config('city_score.version'));
        $this->assertSame('city-priority-v0-demo', config('city_priority.version'));
        $this->assertSame([], config('city_score.metric_rules'));
    }
}
