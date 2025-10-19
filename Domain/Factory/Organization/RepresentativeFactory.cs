namespace Domain.Factory;

using Domain.Model;

public class RepresentativeFactory : IRepresentativeFactory
{
    public Representative NewRepresentative(string name, string citizenId, string nationality, string email, string phoneNumber)
    {
        return new Representative(name, citizenId, nationality, email, phoneNumber);
    }
}