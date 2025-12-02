namespace Domain.Factory;


using Domain.Model;

public interface IOperationPlanFactory
{
    OperationPlan NewOperationPlan(List<OperationEntry> list, DateTime targetDay, string author, string algorithm,  DateTime createdAt);
    
}