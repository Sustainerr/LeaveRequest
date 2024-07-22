namespace TelnetTeamClient.DTO
{
    public class UtilisateurDetailsDto
    {
        public int Matricule { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Role { get; set; }
        public int Groupe_Id { get; set; }
        public int CongesDispo { get; set; }
        public int AutorisationDispo { get; set; }
    }
}
