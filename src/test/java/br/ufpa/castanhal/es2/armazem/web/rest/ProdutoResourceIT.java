package br.ufpa.castanhal.es2.armazem.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.ufpa.castanhal.es2.armazem.IntegrationTest;
import br.ufpa.castanhal.es2.armazem.domain.Produto;
import br.ufpa.castanhal.es2.armazem.repository.ProdutoRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProdutoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProdutoResourceIT {

    private static final String DEFAULT_NOME_PRODUTO = "AAAAAAAAAA";
    private static final String UPDATED_NOME_PRODUTO = "BBBBBBBBBB";

    private static final String DEFAULT_ALTURA = "AAAAAAAAAA";
    private static final String UPDATED_ALTURA = "BBBBBBBBBB";

    private static final String DEFAULT_LARGURA = "AAAAAAAAAA";
    private static final String UPDATED_LARGURA = "BBBBBBBBBB";

    private static final String DEFAULT_COMPRIMENTO = "AAAAAAAAAA";
    private static final String UPDATED_COMPRIMENTO = "BBBBBBBBBB";

    private static final String DEFAULT_CODIGO_DE_BARRA = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO_DE_BARRA = "BBBBBBBBBB";

    private static final String DEFAULT_TIPO_DE_PRODUTO = "AAAAAAAAAA";
    private static final String UPDATED_TIPO_DE_PRODUTO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_VALIDADE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VALIDADE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/produtos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProdutoRepository produtoRepository;

    @Mock
    private ProdutoRepository produtoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProdutoMockMvc;

    private Produto produto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Produto createEntity(EntityManager em) {
        Produto produto = new Produto()
            .nomeProduto(DEFAULT_NOME_PRODUTO)
            .altura(DEFAULT_ALTURA)
            .largura(DEFAULT_LARGURA)
            .comprimento(DEFAULT_COMPRIMENTO)
            .codigoDeBarra(DEFAULT_CODIGO_DE_BARRA)
            .tipoDeProduto(DEFAULT_TIPO_DE_PRODUTO)
            .validade(DEFAULT_VALIDADE);
        return produto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Produto createUpdatedEntity(EntityManager em) {
        Produto produto = new Produto()
            .nomeProduto(UPDATED_NOME_PRODUTO)
            .altura(UPDATED_ALTURA)
            .largura(UPDATED_LARGURA)
            .comprimento(UPDATED_COMPRIMENTO)
            .codigoDeBarra(UPDATED_CODIGO_DE_BARRA)
            .tipoDeProduto(UPDATED_TIPO_DE_PRODUTO)
            .validade(UPDATED_VALIDADE);
        return produto;
    }

    @BeforeEach
    public void initTest() {
        produto = createEntity(em);
    }

    @Test
    @Transactional
    void createProduto() throws Exception {
        int databaseSizeBeforeCreate = produtoRepository.findAll().size();
        // Create the Produto
        restProdutoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produto)))
            .andExpect(status().isCreated());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeCreate + 1);
        Produto testProduto = produtoList.get(produtoList.size() - 1);
        assertThat(testProduto.getNomeProduto()).isEqualTo(DEFAULT_NOME_PRODUTO);
        assertThat(testProduto.getAltura()).isEqualTo(DEFAULT_ALTURA);
        assertThat(testProduto.getLargura()).isEqualTo(DEFAULT_LARGURA);
        assertThat(testProduto.getComprimento()).isEqualTo(DEFAULT_COMPRIMENTO);
        assertThat(testProduto.getCodigoDeBarra()).isEqualTo(DEFAULT_CODIGO_DE_BARRA);
        assertThat(testProduto.getTipoDeProduto()).isEqualTo(DEFAULT_TIPO_DE_PRODUTO);
        assertThat(testProduto.getValidade()).isEqualTo(DEFAULT_VALIDADE);
    }

    @Test
    @Transactional
    void createProdutoWithExistingId() throws Exception {
        // Create the Produto with an existing ID
        produto.setId(1L);

        int databaseSizeBeforeCreate = produtoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProdutoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produto)))
            .andExpect(status().isBadRequest());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProdutos() throws Exception {
        // Initialize the database
        produtoRepository.saveAndFlush(produto);

        // Get all the produtoList
        restProdutoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(produto.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomeProduto").value(hasItem(DEFAULT_NOME_PRODUTO)))
            .andExpect(jsonPath("$.[*].altura").value(hasItem(DEFAULT_ALTURA)))
            .andExpect(jsonPath("$.[*].largura").value(hasItem(DEFAULT_LARGURA)))
            .andExpect(jsonPath("$.[*].comprimento").value(hasItem(DEFAULT_COMPRIMENTO)))
            .andExpect(jsonPath("$.[*].codigoDeBarra").value(hasItem(DEFAULT_CODIGO_DE_BARRA)))
            .andExpect(jsonPath("$.[*].tipoDeProduto").value(hasItem(DEFAULT_TIPO_DE_PRODUTO)))
            .andExpect(jsonPath("$.[*].validade").value(hasItem(DEFAULT_VALIDADE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProdutosWithEagerRelationshipsIsEnabled() throws Exception {
        when(produtoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProdutoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(produtoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProdutosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(produtoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProdutoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(produtoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getProduto() throws Exception {
        // Initialize the database
        produtoRepository.saveAndFlush(produto);

        // Get the produto
        restProdutoMockMvc
            .perform(get(ENTITY_API_URL_ID, produto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(produto.getId().intValue()))
            .andExpect(jsonPath("$.nomeProduto").value(DEFAULT_NOME_PRODUTO))
            .andExpect(jsonPath("$.altura").value(DEFAULT_ALTURA))
            .andExpect(jsonPath("$.largura").value(DEFAULT_LARGURA))
            .andExpect(jsonPath("$.comprimento").value(DEFAULT_COMPRIMENTO))
            .andExpect(jsonPath("$.codigoDeBarra").value(DEFAULT_CODIGO_DE_BARRA))
            .andExpect(jsonPath("$.tipoDeProduto").value(DEFAULT_TIPO_DE_PRODUTO))
            .andExpect(jsonPath("$.validade").value(DEFAULT_VALIDADE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProduto() throws Exception {
        // Get the produto
        restProdutoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProduto() throws Exception {
        // Initialize the database
        produtoRepository.saveAndFlush(produto);

        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();

        // Update the produto
        Produto updatedProduto = produtoRepository.findById(produto.getId()).get();
        // Disconnect from session so that the updates on updatedProduto are not directly saved in db
        em.detach(updatedProduto);
        updatedProduto
            .nomeProduto(UPDATED_NOME_PRODUTO)
            .altura(UPDATED_ALTURA)
            .largura(UPDATED_LARGURA)
            .comprimento(UPDATED_COMPRIMENTO)
            .codigoDeBarra(UPDATED_CODIGO_DE_BARRA)
            .tipoDeProduto(UPDATED_TIPO_DE_PRODUTO)
            .validade(UPDATED_VALIDADE);

        restProdutoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProduto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProduto))
            )
            .andExpect(status().isOk());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
        Produto testProduto = produtoList.get(produtoList.size() - 1);
        assertThat(testProduto.getNomeProduto()).isEqualTo(UPDATED_NOME_PRODUTO);
        assertThat(testProduto.getAltura()).isEqualTo(UPDATED_ALTURA);
        assertThat(testProduto.getLargura()).isEqualTo(UPDATED_LARGURA);
        assertThat(testProduto.getComprimento()).isEqualTo(UPDATED_COMPRIMENTO);
        assertThat(testProduto.getCodigoDeBarra()).isEqualTo(UPDATED_CODIGO_DE_BARRA);
        assertThat(testProduto.getTipoDeProduto()).isEqualTo(UPDATED_TIPO_DE_PRODUTO);
        assertThat(testProduto.getValidade()).isEqualTo(UPDATED_VALIDADE);
    }

    @Test
    @Transactional
    void putNonExistingProduto() throws Exception {
        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();
        produto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdutoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, produto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProduto() throws Exception {
        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();
        produto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(produto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProduto() throws Exception {
        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();
        produto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(produto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProdutoWithPatch() throws Exception {
        // Initialize the database
        produtoRepository.saveAndFlush(produto);

        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();

        // Update the produto using partial update
        Produto partialUpdatedProduto = new Produto();
        partialUpdatedProduto.setId(produto.getId());

        partialUpdatedProduto.validade(UPDATED_VALIDADE);

        restProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProduto))
            )
            .andExpect(status().isOk());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
        Produto testProduto = produtoList.get(produtoList.size() - 1);
        assertThat(testProduto.getNomeProduto()).isEqualTo(DEFAULT_NOME_PRODUTO);
        assertThat(testProduto.getAltura()).isEqualTo(DEFAULT_ALTURA);
        assertThat(testProduto.getLargura()).isEqualTo(DEFAULT_LARGURA);
        assertThat(testProduto.getComprimento()).isEqualTo(DEFAULT_COMPRIMENTO);
        assertThat(testProduto.getCodigoDeBarra()).isEqualTo(DEFAULT_CODIGO_DE_BARRA);
        assertThat(testProduto.getTipoDeProduto()).isEqualTo(DEFAULT_TIPO_DE_PRODUTO);
        assertThat(testProduto.getValidade()).isEqualTo(UPDATED_VALIDADE);
    }

    @Test
    @Transactional
    void fullUpdateProdutoWithPatch() throws Exception {
        // Initialize the database
        produtoRepository.saveAndFlush(produto);

        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();

        // Update the produto using partial update
        Produto partialUpdatedProduto = new Produto();
        partialUpdatedProduto.setId(produto.getId());

        partialUpdatedProduto
            .nomeProduto(UPDATED_NOME_PRODUTO)
            .altura(UPDATED_ALTURA)
            .largura(UPDATED_LARGURA)
            .comprimento(UPDATED_COMPRIMENTO)
            .codigoDeBarra(UPDATED_CODIGO_DE_BARRA)
            .tipoDeProduto(UPDATED_TIPO_DE_PRODUTO)
            .validade(UPDATED_VALIDADE);

        restProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProduto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProduto))
            )
            .andExpect(status().isOk());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
        Produto testProduto = produtoList.get(produtoList.size() - 1);
        assertThat(testProduto.getNomeProduto()).isEqualTo(UPDATED_NOME_PRODUTO);
        assertThat(testProduto.getAltura()).isEqualTo(UPDATED_ALTURA);
        assertThat(testProduto.getLargura()).isEqualTo(UPDATED_LARGURA);
        assertThat(testProduto.getComprimento()).isEqualTo(UPDATED_COMPRIMENTO);
        assertThat(testProduto.getCodigoDeBarra()).isEqualTo(UPDATED_CODIGO_DE_BARRA);
        assertThat(testProduto.getTipoDeProduto()).isEqualTo(UPDATED_TIPO_DE_PRODUTO);
        assertThat(testProduto.getValidade()).isEqualTo(UPDATED_VALIDADE);
    }

    @Test
    @Transactional
    void patchNonExistingProduto() throws Exception {
        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();
        produto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, produto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProduto() throws Exception {
        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();
        produto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(produto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProduto() throws Exception {
        int databaseSizeBeforeUpdate = produtoRepository.findAll().size();
        produto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProdutoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(produto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Produto in the database
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProduto() throws Exception {
        // Initialize the database
        produtoRepository.saveAndFlush(produto);

        int databaseSizeBeforeDelete = produtoRepository.findAll().size();

        // Delete the produto
        restProdutoMockMvc
            .perform(delete(ENTITY_API_URL_ID, produto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Produto> produtoList = produtoRepository.findAll();
        assertThat(produtoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
