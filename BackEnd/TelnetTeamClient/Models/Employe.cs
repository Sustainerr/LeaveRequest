using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TelnetTeamClient.Models
{
    public class Employe
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Matricule { get; set; }
        public int CongesDispo { get; set; }
        public int AutorisationDispo { get; set; }
        public int GroupeId { get; set; }

        [ForeignKey("GroupeId")]
        public Groupe Groupe { get; set; }

        [ForeignKey("Matricule")]
        public Utilisateur Utilisateur { get; set; }
    }
}
