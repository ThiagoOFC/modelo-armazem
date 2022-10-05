package br.ufpa.castanhal.es2.armazem.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Produto.
 */
@Entity
@Table(name = "produto")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Produto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nome_produto")
    private String nomeProduto;

    @Column(name = "altura")
    private String altura;

    @Column(name = "largura")
    private String largura;

    @Column(name = "comprimento")
    private String comprimento;

    @Column(name = "codigo_de_barra")
    private String codigoDeBarra;

    @Column(name = "tipo_de_produto")
    private String tipoDeProduto;

    @Column(name = "validade")
    private LocalDate validade;

    @OneToOne
    @JoinColumn(unique = true)
    private ProdutoCadastrado produtoCadastrado;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Produto id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeProduto() {
        return this.nomeProduto;
    }

    public Produto nomeProduto(String nomeProduto) {
        this.setNomeProduto(nomeProduto);
        return this;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public String getAltura() {
        return this.altura;
    }

    public Produto altura(String altura) {
        this.setAltura(altura);
        return this;
    }

    public void setAltura(String altura) {
        this.altura = altura;
    }

    public String getLargura() {
        return this.largura;
    }

    public Produto largura(String largura) {
        this.setLargura(largura);
        return this;
    }

    public void setLargura(String largura) {
        this.largura = largura;
    }

    public String getComprimento() {
        return this.comprimento;
    }

    public Produto comprimento(String comprimento) {
        this.setComprimento(comprimento);
        return this;
    }

    public void setComprimento(String comprimento) {
        this.comprimento = comprimento;
    }

    public String getCodigoDeBarra() {
        return this.codigoDeBarra;
    }

    public Produto codigoDeBarra(String codigoDeBarra) {
        this.setCodigoDeBarra(codigoDeBarra);
        return this;
    }

    public void setCodigoDeBarra(String codigoDeBarra) {
        this.codigoDeBarra = codigoDeBarra;
    }

    public String getTipoDeProduto() {
        return this.tipoDeProduto;
    }

    public Produto tipoDeProduto(String tipoDeProduto) {
        this.setTipoDeProduto(tipoDeProduto);
        return this;
    }

    public void setTipoDeProduto(String tipoDeProduto) {
        this.tipoDeProduto = tipoDeProduto;
    }

    public LocalDate getValidade() {
        return this.validade;
    }

    public Produto validade(LocalDate validade) {
        this.setValidade(validade);
        return this;
    }

    public void setValidade(LocalDate validade) {
        this.validade = validade;
    }

    public ProdutoCadastrado getProdutoCadastrado() {
        return this.produtoCadastrado;
    }

    public void setProdutoCadastrado(ProdutoCadastrado produtoCadastrado) {
        this.produtoCadastrado = produtoCadastrado;
    }

    public Produto produtoCadastrado(ProdutoCadastrado produtoCadastrado) {
        this.setProdutoCadastrado(produtoCadastrado);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Produto)) {
            return false;
        }
        return id != null && id.equals(((Produto) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Produto{" +
            "id=" + getId() +
            ", nomeProduto='" + getNomeProduto() + "'" +
            ", altura='" + getAltura() + "'" +
            ", largura='" + getLargura() + "'" +
            ", comprimento='" + getComprimento() + "'" +
            ", codigoDeBarra='" + getCodigoDeBarra() + "'" +
            ", tipoDeProduto='" + getTipoDeProduto() + "'" +
            ", validade='" + getValidade() + "'" +
            "}";
    }
}
