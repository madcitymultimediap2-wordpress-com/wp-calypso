import { useQuery, UseQueryResult } from '@tanstack/react-query';
import wpcom from 'calypso/lib/wp';
import { PriceTierListItemProps } from '../stats-purchase/types';
import getDefaultQueryParams from './default-query-params';

interface PeriodUsage {
	current_start: string | null;
	next_start: string | null;
	views_count: number;
	days_to_reset: number;
}

export interface PlanUsage {
	current_usage: PeriodUsage;
	recent_usages: Array< PeriodUsage >;
	views_limit: number;
	over_limit_months: number;
	current_tier: PriceTierListItemProps;
	is_internal: boolean;
}

function selectPlanUsage( payload: PlanUsage ): PlanUsage {
	return payload;
}

function queryPlanUsage( siteId: number | null ): Promise< PlanUsage > {
	return wpcom.req.get( {
		apiNamespace: 'wpcom/v2',
		path: `/sites/${ siteId }/jetpack-stats/usage`,
	} );
}

export default function usePlanUsageQuery(
	siteId: number | null
): UseQueryResult< PlanUsage, unknown > {
	return useQuery( {
		...getDefaultQueryParams< PlanUsage >(),
		queryKey: [ 'stats', 'usage', siteId ],
		queryFn: () => queryPlanUsage( siteId ),
		select: selectPlanUsage,
		staleTime: 5 * 1000, // 5 seconds
	} );
}
