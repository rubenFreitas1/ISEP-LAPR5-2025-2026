namespace Domain.IRepository;

using Domain.Model;

public interface IOperationPlanRepository : IGenericRepository<OperationPlan>
{
    Task<IEnumerable<OperationPlan>> GetAllOperationPlansAsync();

    Task<OperationPlan?> GetOperationPlanByIdAsync(long id);

    Task<IEnumerable<OperationPlan>> GetOperationPlanByAuthorAsync(string author);

    Task<IEnumerable<OperationPlan>> GetOperationPlanByAlgorithmAsync(string algorithm);

    Task<OperationPlan?> GetOperationPlanByTargetDayAsync(DateTime targetDay);

    Task<OperationPlan> AddOperationPlan(OperationPlan operationPlan);

    Task<OperationPlan?> Update(OperationPlan operationPlan, List<string> errorMessages);

    Task<bool> OperationPlanExists(long id);
}