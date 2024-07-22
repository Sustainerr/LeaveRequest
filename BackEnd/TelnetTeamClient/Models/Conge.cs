using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TelnetTeamClient.Models
{
    [Table("Conge")]
    public class Conge
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Conge_Id { get; set; }
        public DateTime Date_Debut { get; set; }
        public DateTime Date_Fin { get; set; }
        public string Statut { get; set; }
        public int Type_Conge_Id { get; set; }
        public int Matricule { get; set; }

        [ForeignKey("Matricule")]
        public Utilisateur Utilisateur { get; set; }

        [ForeignKey("Type_Conge_Id")]
        public TypeConge TypeConge { get; set; }
    }
}
