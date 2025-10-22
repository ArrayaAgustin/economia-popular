using System;
using System.Collections.Generic;
using Api.Data.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Api.Data.Contexts;

public partial class EFContext : DbContext
{
    private readonly IConfiguration _configuration;

public EFContext(DbContextOptions<EFContext> options, IConfiguration configuration)
    : base(options)
{
    _configuration = configuration;
}

    public virtual DbSet<TRoles> TRoles { get; set; }

    public virtual DbSet<TUsuarios> TUsuarios { get; set; }

    public virtual DbSet<TRefreshTokens> TRefreshTokens { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    if (!optionsBuilder.IsConfigured)
    {
        var connectionString = _configuration.GetConnectionString("MySqlDb");
        optionsBuilder.UseMySql(connectionString, ServerVersion.Parse("8.0.39-mysql"));
    }
}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<TRoles>(entity =>
        {
            entity.HasKey(e => e.IdRol).HasName("PRIMARY");

            entity.ToTable("t_roles");

            entity.Property(e => e.IdRol).HasColumnName("ID_ROL");
            entity.Property(e => e.Activo)
                .HasDefaultValueSql("'1'")
                .HasColumnName("ACTIVO");
            entity.Property(e => e.FechaBaja)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_BAJA");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("FECHA_CREACION");
            entity.Property(e => e.Rol)
                .HasMaxLength(255)
                .HasColumnName("ROL");
        });

        modelBuilder.Entity<TUsuarios>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PRIMARY");

            entity.ToTable("t_usuarios");

            entity.HasIndex(e => e.Cuil, "CUIL").IsUnique();

            entity.HasIndex(e => e.IdRol, "ID_ROL");

            entity.Property(e => e.IdUsuario).HasColumnName("ID_USUARIO");
            entity.Property(e => e.Activo)
                .HasDefaultValueSql("'1'")
                .HasColumnName("ACTIVO");
            entity.Property(e => e.Apellido)
                .HasMaxLength(255)
                .HasColumnName("APELLIDO");
            entity.Property(e => e.Cuil)
                .HasMaxLength(11)
                .HasColumnName("CUIL");
            entity.Property(e => e.FechaBaja)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_BAJA");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("FECHA_CREACION");
            entity.Property(e => e.IdRol).HasColumnName("ID_ROL");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .HasColumnName("NOMBRE");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.TUsuarios)
                .HasForeignKey(d => d.IdRol)
                .HasConstraintName("t_usuarios_ibfk_1");
        });
        modelBuilder.Entity<TRefreshTokens>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("t_refresh_tokens");

            entity.HasIndex(e => e.Cuil, "CUIL");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Cuil)
                .HasMaxLength(11)
                .HasColumnName("CUIL");
            entity.Property(e => e.Expiration)
                .HasColumnType("datetime")
                .HasColumnName("EXPIRATION");
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(255)
                .HasColumnName("REFRESH_TOKEN");

            entity.HasOne(d => d.CuilNavigation).WithMany(p => p.TRefreshTokens)
                .HasPrincipalKey(p => p.Cuil)
                .HasForeignKey(d => d.Cuil)
                .HasConstraintName("t_refresh_tokens_ibfk_1");
        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
