namespace Domain.Factory;

using Domain.Model;

public interface IRepresentativeFactory
{
    Representative NewRepresentative(string name, string citizenId, string nationality, string email, string phoneNumber);
}