using Microsoft.EntityFrameworkCore;
using TelnetTeamClient.Models;

namespace TelnetTeamClient.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Groupe> Groupes { get; set; }
        public DbSet<Conge> Conges { get; set; }
        public DbSet<Autorisation> Autorisations { get; set; }
        public DbSet<TypeConge> TypesConge { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Utilisateur>()
                .HasOne(e => e.Groupe)
                .WithMany(g => g.Utilisateurs)
                .HasForeignKey(e => e.Groupe_Id);

            modelBuilder.Entity<Autorisation>()
                .HasOne(e => e.Utilisateur)
                .WithMany(g => g.Autorisations)
                .HasForeignKey(e => e.Matricule);

            modelBuilder.Entity<Conge>()
                .HasOne(e => e.Utilisateur)
                .WithMany(g => g.Conges)
                .HasForeignKey(e => e.Matricule);

            modelBuilder.Entity<Conge>()
                .HasOne(e => e.TypeConge)
                .WithMany(t => t.Conges)
                .HasForeignKey(e => e.Type_Conge_Id);
        }
    }
}