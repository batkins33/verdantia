import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { AlertsResponseSchema, type AlertsResponse } from '../schemas';

export function useAlerts(city: string = 'Keller') {
  return useQuery({
    queryKey: ['alerts', city],
    queryFn: async (): Promise<AlertsResponse> => {
      const response = await api.get('/v1/alerts', {
        params: { city },
      });
      return AlertsResponseSchema.parse(response.data);
    },
    enabled: !!city,
  });
}
