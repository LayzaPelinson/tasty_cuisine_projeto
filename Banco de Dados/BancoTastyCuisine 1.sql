CREATE DATABASE TASTYCUISINE
GO
USE TASTYCUISINE
GO

CREATE TABLE Usuario (
    Cod_user INT IDENTITY(1,1) PRIMARY KEY,
    Nome_completo NVARCHAR(300) NOT NULL,
    Nome_de_usuario NVARCHAR(60) NOT NULL,
    Idade INT NOT NULL,
    Gmail NVARCHAR(255) NOT NULL UNIQUE,
    Senha NVARCHAR(250) NOT NULL,
    Status_Usuario NVARCHAR(20) NOT NULL default 'ATIVO',
    Restricoes_alimentares NVARCHAR(MAX) default 'lactose' NULL,
    foto_perfil NVARCHAR(MAX) NULL,
    funcao NVARCHAR(30) NOT NULL, -- Chefe ou Usuario,

    CONSTRAINT chk_restricoes CHECK (ISJSON(Restricoes_alimentares) = 1),
);

CREATE TABLE Categorias (
    Cod_Categoria INT IDENTITY(1,1) PRIMARY KEY,
    Nome_Categoria NVARCHAR(100) NOT NULL,
);

CREATE TABLE Receitas (
    Cod_receitas INT IDENTITY(1,1) PRIMARY KEY,
    Nome_receita NVARCHAR(250) NOT NULL,
    Descricao NVARCHAR(250) NOT NULL,
    Modo_preparo NVARCHAR(MAX) NOT NULL,
    Ingredientes NVARCHAR(MAX) NOT NULL,
    Cod_usuario INT NOT NULL,
    Foto_receita NVARCHAR(MAX),
    Restricao INT NOT NULL,
    FOREIGN KEY (Cod_usuario) REFERENCES Usuario(Cod_user),
    CONSTRAINT chk_ingredientes CHECK (Ingredientes IS NULL OR ISJSON(Ingredientes) = 1),
    CONSTRAINT chk_modo_preparo CHECK (ISJSON(Modo_preparo) = 1)
);

CREATE TABLE Favoritos (
    Cod_favoritos BIGINT IDENTITY(1,1) PRIMARY KEY,
    Cod_user INT NOT NULL,
    Cod_receitas INT,
    FOREIGN KEY (Cod_user) REFERENCES Usuario(Cod_user),
    FOREIGN KEY (Cod_receitas) REFERENCES Receitas(Cod_receitas)
);

CREATE TABLE Comentarios (
    Cod_comentarios BIGINT IDENTITY(1,1) PRIMARY KEY,
    Cod_user INT NOT NULL,
    Cod_receitas INT NULL,
    Texto NVARCHAR(300) NOT NULL,
    Nota INT NOT NULL CHECK (Nota BETWEEN 1 AND 5),
    Data_Comentario DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (Cod_user) REFERENCES Usuario(Cod_user),
    FOREIGN KEY (Cod_receitas) REFERENCES Receitas(Cod_receitas)
);

CREATE TABLE Livros(
    Cod_Livros INT IDENTITY(1,1) PRIMARY KEY,
    Nome_Livro NVARCHAR(50) NOT NULL,
    Foto_Livro NVARCHAR(MAX) NULL,
    Cod_User INT NOT NULL,
       
    FOREIGN KEY (Cod_User) REFERENCES Usuario(Cod_user),
);

CREATE TABLE Livro_Receitas(
    Cod_Livros INT NOT NULL,
    Cod_Receita INT NOT NULL
)

CREATE TABLE Receitas_Categorias(
    Cod_Categoria INT NOT NULL,
    Cod_Receita INT NOT NULL
)

GO

insert into Usuario(Nome_completo,Nome_de_usuario,Idade,Gmail,Senha,Restricoes_alimentares,funcao)
VALUES('soso','Sooo','25','gmail@gmail.com','123456','[]','Usuario')

insert into Categorias(Nome_Categoria)
values('Massas')

insert into Receitas(Nome_receita,Descricao,Ingredientes,Modo_preparo,Restricao,Cod_usuario)
values('arroz','arroz cozido','["Farinha", "Ovo", "Leite"]','["Misture os ingredientes","Coloque na forma","Asse por 40 minutos"]',15,1)

insert into livros(Nome_Livro,Cod_User)
values('edurado',1)

insert into Livro_Receitas(Cod_Livros,Cod_Receita)
values(1,1)

insert into Receitas_Categorias(Cod_Categoria,Cod_Receita)
values(1,1)
GO
 
SELECT * FROM Usuario
    Select * From Comentarios
    select * from Categorias
select * from Receitas
select * from Favoritos
select * from Livros    
SELECT * FROM Livro_Receitas;

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Livros';

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Receitas';

insert into livro_receitas(cod_livro,cod_receitas)
values(3,2)