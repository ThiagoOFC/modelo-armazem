package br.ufpa.castanhal.es2.armazem.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Armazenamento.
 */
@Entity
@Table(name = "armazenamento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Armazenamento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "local")
    private String local;

    @Column(name = "tipo_de_armazenamento")
    private String tipoDeArmazenamento;

    @Column(name = "endereco")
    private String endereco;

    @OneToOne
    @JoinColumn(unique = true)
    private ProdutoCadastrado produtoCadastrado;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Armazenamento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocal() {
        return this.local;
    }

    public Armazenamento local(String local) {
        this.setLocal(local);
        return this;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public String getTipoDeArmazenamento() {
        return this.tipoDeArmazenamento;
    }

    public Armazenamento tipoDeArmazenamento(String tipoDeArmazenamento) {
        this.setTipoDeArmazenamento(tipoDeArmazenamento);
        return this;
    }

    public void setTipoDeArmazenamento(String tipoDeArmazenamento) {
        this.tipoDeArmazenamento = tipoDeArmazenamento;
    }

    public String getEndereco() {
        return this.endereco;
    }

    public Armazenamento endereco(String endereco) {
        this.setEndereco(endereco);
        return this;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public ProdutoCadastrado getProdutoCadastrado() {
        return this.produtoCadastrado;
    }

    public void setProdutoCadastrado(ProdutoCadastrado produtoCadastrado) {
        this.produtoCadastrado = produtoCadastrado;
    }

    public Armazenamento produtoCadastrado(ProdutoCadastrado produtoCadastrado) {
        this.setProdutoCadastrado(produtoCadastrado);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Armazenamento)) {
            return false;
        }
        return id != null && id.equals(((Armazenamento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Armazenamento{" +
            "id=" + getId() +
            ", local='" + getLocal() + "'" +
            ", tipoDeArmazenamento='" + getTipoDeArmazenamento() + "'" +
            ", endereco='" + getEndereco() + "'" +
            "}";
    }
}
