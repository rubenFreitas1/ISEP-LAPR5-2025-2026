using System;
using System.Diagnostics.Contracts;

namespace Domain.Model;

public class Representative
{
    public long Id { get; set; }

    public string? Name { get; private set; }

    public string? CitizenId { get; private set; }

    public string? Nationality { get; private set; }

    public string? Email { get; private set; }

    public string? PhoneNumber { get; private set; }

    public DateTime LastModifiedAt { get; set; }

    private Representative() { }

    public Representative(string name, string citizenId, string nationality, string email, string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name cannot be null or empty.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(citizenId))
        {
            throw new ArgumentException("Citizen ID cannot be null or empty.", nameof(citizenId));
        }

        if (string.IsNullOrWhiteSpace(nationality))
        {
            throw new ArgumentException("Nationality cannot be null or empty.", nameof(nationality));
        }
        if (string.IsNullOrWhiteSpace(email) && email.Contains("@") == false)
        {
            throw new ArgumentException("Email cannot be null or empty.", nameof(email));
        }
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            throw new ArgumentException("Phone number cannot be null or empty.", nameof(phoneNumber));
        }

        Name = name;
        CitizenId = citizenId;
        Nationality = nationality;
        Email = email;
        PhoneNumber = phoneNumber;
        LastModifiedAt = DateTime.UtcNow;
    }


    public void ChangeEmail(string newEmail)
    {
        if (string.IsNullOrWhiteSpace(newEmail) && newEmail.Contains("@") == false)
        {
            throw new ArgumentException("Email cannot be null or empty.", nameof(newEmail));
        }

        Email = newEmail;
        LastModifiedAt = DateTime.UtcNow;
    }


    public void ChangePhoneNumber(string newPhoneNumber)
    {
        if (string.IsNullOrWhiteSpace(newPhoneNumber))
        {
            throw new ArgumentException("Phone number cannot be null or empty.", nameof(newPhoneNumber));
        }

        PhoneNumber = newPhoneNumber;
        LastModifiedAt = DateTime.UtcNow;
    }


}