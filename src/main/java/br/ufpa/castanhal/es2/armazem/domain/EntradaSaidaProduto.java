package br.ufpa.castanhal.es2.armazem.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EntradaSaidaProduto.
 */
@Entity
@Table(name = "entrada_saida_produto")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EntradaSaidaProduto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "quando")
    private ZonedDateTime quando;

    @Column(name = "quantidade")
    private String quantidade;

    @ManyToOne
    private ProdutoCadastrado produtoCadastrado;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EntradaSaidaProduto id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getQuando() {
        return this.quando;
    }

    public EntradaSaidaProduto quando(ZonedDateTime quando) {
        this.setQuando(quando);
        return this;
    }

    public void setQuando(ZonedDateTime quando) {
        this.quando = quando;
    }

    public String getQuantidade() {
        return this.quantidade;
    }

    public EntradaSaidaProduto quantidade(String quantidade) {
        this.setQuantidade(quantidade);
        return this;
    }

    public void setQuantidade(String quantidade) {
        this.quantidade = quantidade;
    }

    public ProdutoCadastrado getProdutoCadastrado() {
        return this.produtoCadastrado;
    }

    public void setProdutoCadastrado(ProdutoCadastrado produtoCadastrado) {
        this.produtoCadastrado = produtoCadastrado;
    }

    public EntradaSaidaProduto produtoCadastrado(ProdutoCadastrado produtoCadastrado) {
        this.setProdutoCadastrado(produtoCadastrado);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EntradaSaidaProduto)) {
            return false;
        }
        return id != null && id.equals(((EntradaSaidaProduto) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EntradaSaidaProduto{" +
            "id=" + getId() +
            ", quando='" + getQuando() + "'" +
            ", quantidade='" + getQuantidade() + "'" +
            "}";
    }
}
