namespace TelnetTeamClient.DTO
{
    public class CongeDto
    {
        public int Conge_Id { get; set; }  // Add this line
        public DateTime Date_Debut { get; set; }
        public DateTime Date_Fin { get; set; }
        public string Statut { get; set; }
        public int Type_Conge_Id { get; set; }
        public int Matricule { get; set; }
    }
}
