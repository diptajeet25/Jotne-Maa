import { useMutation } from '@tanstack/react-query'
import { generateDietPlan } from '../Services/dietPlannerApi'

const useDietPlanner = () => {
  return useMutation({
    mutationFn: generateDietPlan,
  })
}

export default useDietPlanner