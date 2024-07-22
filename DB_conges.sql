CREATE TABLE Groupe (
    Groupe_Id INT PRIMARY KEY IDENTITY(1,1),
    Nom_groupe NVARCHAR(100) 
);

CREATE TABLE Utilisateur (
    Matricule INT PRIMARY KEY IDENTITY(1,1),
    Nom NVARCHAR(100),
    Prenom NVARCHAR(100),
    Email NVARCHAR(100),
    MotDePasse NVARCHAR(100),
    Role NVARCHAR(50),
    CongesDispo INT,
    AutorisationDispo INT,
    Groupe_Id INT,
    CONSTRAINT FK_Utilisateur_Groupe FOREIGN KEY (Groupe_Id) REFERENCES Groupe(Groupe_Id)
);

CREATE TABLE TypeConge (
    Type_Conge_Id INT PRIMARY KEY IDENTITY(1,1),
    Type NVARCHAR(100) 
	Role NVARCHAR(50)
);

CREATE TABLE Conge (
    Conge_Id INT PRIMARY KEY IDENTITY(1,1),
    Date_Debut DATE ,
    Date_Fin DATE ,
    Statut NVARCHAR(50) ,
    Matricule INT ,
    Type_Conge_Id INT ,
    CONSTRAINT FK_Conge_Utilisateur FOREIGN KEY (Matricule) REFERENCES Utilisateur(Matricule),
    CONSTRAINT FK_Conge_TypeConge FOREIGN KEY (Type_Conge_Id) REFERENCES TypeConge(Type_Conge_Id)
);

CREATE TABLE Autorisation (
    Autorisation_Id INT PRIMARY KEY IDENTITY(1,1),
    Statut NVARCHAR(50) ,
    Date DATE ,
    HeureDebut TIME ,
    HeureFin TIME ,
    Matricule INT ,
    CONSTRAINT FK_Autorisation_Utilisateur FOREIGN KEY (Matricule) REFERENCES Utilisateur(Matricule)
);