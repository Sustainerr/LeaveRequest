using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TelnetTeamClient.Models
{
    [Table("utilisateur")]
    public class Utilisateur
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Matricule { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Email { get; set; }
        public string MotDePasse { get; set; }
        public string Role { get; set; }
        public ICollection<Autorisation> Autorisations { get; set; }
        public ICollection<Conge> Conges { get; set; }
        public int CongesDispo { get; set; }
        public int AutorisationDispo { get; set; }
        public int Groupe_Id { get; set; }

        [ForeignKey("Groupe_Id")]
        public Groupe Groupe { get; set; }
    }
}
