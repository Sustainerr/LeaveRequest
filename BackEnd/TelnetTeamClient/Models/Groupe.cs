using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TelnetTeamClient.Models
{
    public class Groupe
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Groupe_Id { get; set; }
        public string Nom_Groupe { get; set; }

        public ICollection<Utilisateur> Utilisateurs { get; set; }
    }
}
