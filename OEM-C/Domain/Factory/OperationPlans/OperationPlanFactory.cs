namespace Domain.Factory;

using Domain.Model;

public class OperationPlanFactory : IOperationPlanFactory
{
    public OperationPlan NewOperationPlan(List<OperationEntry> list, DateTime targetDay, string author, string algorithm,  DateTime createdAt)
    {
        return new OperationPlan(list, targetDay, author, algorithm, createdAt);
    }
    
}