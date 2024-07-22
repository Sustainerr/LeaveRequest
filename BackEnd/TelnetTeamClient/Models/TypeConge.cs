using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TelnetTeamClient.Models
{
    [Table("TypeConge")]
    public class TypeConge
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Type_Conge_Id { get; set; }
        public string Type { get; set; }
        public string role { get; set; }


        public ICollection<Conge> Conges { get; set; }
    }
}
