using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TelnetTeamClient.Models
{
    public class Autorisation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutorisationId { get; set; }
        public string Statut { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan HeureDebut { get; set; }
        public TimeSpan HeureFin { get; set; }
        public int Matricule { get; set; }

        [ForeignKey("Matricule")]
        public Utilisateur Utilisateur { get; set; }
    }
}
