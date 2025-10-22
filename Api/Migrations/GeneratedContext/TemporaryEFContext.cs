using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Api.Migrations.GeneratedContext;

public partial class TemporaryEFContext : DbContext
{
    public TemporaryEFContext()
    {
    }

    public TemporaryEFContext(DbContextOptions<TemporaryEFContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TRefreshToken> TRefreshTokens { get; set; }

    public virtual DbSet<TRole> TRoles { get; set; }

    public virtual DbSet<TUsuario> TUsuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=cidi;user=usuario_cidi;password=cidi456;pooling=true;min pool size=5;max pool size=50", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.39-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<TRefreshToken>(entity =>
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

        modelBuilder.Entity<TRole>(entity =>
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

        modelBuilder.Entity<TUsuario>(entity =>
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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
