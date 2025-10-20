import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CarePlanSchema, type CarePlan } from '../schemas';

export function useCare(plantId: string) {
  return useQuery({
    queryKey: ['care', plantId],
    queryFn: async (): Promise<CarePlan> => {
      const response = await api.get(`/v1/plants/${plantId}/care`);
      return CarePlanSchema.parse(response.data);
    },
    enabled: !!plantId,
  });
}
