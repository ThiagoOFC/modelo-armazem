package br.ufpa.castanhal.es2.armazem.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.ufpa.castanhal.es2.armazem.IntegrationTest;
import br.ufpa.castanhal.es2.armazem.domain.Armazenamento;
import br.ufpa.castanhal.es2.armazem.repository.ArmazenamentoRepository;
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
 * Integration tests for the {@link ArmazenamentoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ArmazenamentoResourceIT {

    private static final String DEFAULT_LOCAL = "AAAAAAAAAA";
    private static final String UPDATED_LOCAL = "BBBBBBBBBB";

    private static final String DEFAULT_TIPO_DE_ARMAZENAMENTO = "AAAAAAAAAA";
    private static final String UPDATED_TIPO_DE_ARMAZENAMENTO = "BBBBBBBBBB";

    private static final String DEFAULT_ENDERECO = "AAAAAAAAAA";
    private static final String UPDATED_ENDERECO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/armazenamentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ArmazenamentoRepository armazenamentoRepository;

    @Mock
    private ArmazenamentoRepository armazenamentoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restArmazenamentoMockMvc;

    private Armazenamento armazenamento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Armazenamento createEntity(EntityManager em) {
        Armazenamento armazenamento = new Armazenamento()
            .local(DEFAULT_LOCAL)
            .tipoDeArmazenamento(DEFAULT_TIPO_DE_ARMAZENAMENTO)
            .endereco(DEFAULT_ENDERECO);
        return armazenamento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Armazenamento createUpdatedEntity(EntityManager em) {
        Armazenamento armazenamento = new Armazenamento()
            .local(UPDATED_LOCAL)
            .tipoDeArmazenamento(UPDATED_TIPO_DE_ARMAZENAMENTO)
            .endereco(UPDATED_ENDERECO);
        return armazenamento;
    }

    @BeforeEach
    public void initTest() {
        armazenamento = createEntity(em);
    }

    @Test
    @Transactional
    void createArmazenamento() throws Exception {
        int databaseSizeBeforeCreate = armazenamentoRepository.findAll().size();
        // Create the Armazenamento
        restArmazenamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(armazenamento)))
            .andExpect(status().isCreated());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeCreate + 1);
        Armazenamento testArmazenamento = armazenamentoList.get(armazenamentoList.size() - 1);
        assertThat(testArmazenamento.getLocal()).isEqualTo(DEFAULT_LOCAL);
        assertThat(testArmazenamento.getTipoDeArmazenamento()).isEqualTo(DEFAULT_TIPO_DE_ARMAZENAMENTO);
        assertThat(testArmazenamento.getEndereco()).isEqualTo(DEFAULT_ENDERECO);
    }

    @Test
    @Transactional
    void createArmazenamentoWithExistingId() throws Exception {
        // Create the Armazenamento with an existing ID
        armazenamento.setId(1L);

        int databaseSizeBeforeCreate = armazenamentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restArmazenamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(armazenamento)))
            .andExpect(status().isBadRequest());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllArmazenamentos() throws Exception {
        // Initialize the database
        armazenamentoRepository.saveAndFlush(armazenamento);

        // Get all the armazenamentoList
        restArmazenamentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(armazenamento.getId().intValue())))
            .andExpect(jsonPath("$.[*].local").value(hasItem(DEFAULT_LOCAL)))
            .andExpect(jsonPath("$.[*].tipoDeArmazenamento").value(hasItem(DEFAULT_TIPO_DE_ARMAZENAMENTO)))
            .andExpect(jsonPath("$.[*].endereco").value(hasItem(DEFAULT_ENDERECO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllArmazenamentosWithEagerRelationshipsIsEnabled() throws Exception {
        when(armazenamentoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restArmazenamentoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(armazenamentoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllArmazenamentosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(armazenamentoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restArmazenamentoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(armazenamentoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getArmazenamento() throws Exception {
        // Initialize the database
        armazenamentoRepository.saveAndFlush(armazenamento);

        // Get the armazenamento
        restArmazenamentoMockMvc
            .perform(get(ENTITY_API_URL_ID, armazenamento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(armazenamento.getId().intValue()))
            .andExpect(jsonPath("$.local").value(DEFAULT_LOCAL))
            .andExpect(jsonPath("$.tipoDeArmazenamento").value(DEFAULT_TIPO_DE_ARMAZENAMENTO))
            .andExpect(jsonPath("$.endereco").value(DEFAULT_ENDERECO));
    }

    @Test
    @Transactional
    void getNonExistingArmazenamento() throws Exception {
        // Get the armazenamento
        restArmazenamentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingArmazenamento() throws Exception {
        // Initialize the database
        armazenamentoRepository.saveAndFlush(armazenamento);

        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();

        // Update the armazenamento
        Armazenamento updatedArmazenamento = armazenamentoRepository.findById(armazenamento.getId()).get();
        // Disconnect from session so that the updates on updatedArmazenamento are not directly saved in db
        em.detach(updatedArmazenamento);
        updatedArmazenamento.local(UPDATED_LOCAL).tipoDeArmazenamento(UPDATED_TIPO_DE_ARMAZENAMENTO).endereco(UPDATED_ENDERECO);

        restArmazenamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedArmazenamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedArmazenamento))
            )
            .andExpect(status().isOk());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
        Armazenamento testArmazenamento = armazenamentoList.get(armazenamentoList.size() - 1);
        assertThat(testArmazenamento.getLocal()).isEqualTo(UPDATED_LOCAL);
        assertThat(testArmazenamento.getTipoDeArmazenamento()).isEqualTo(UPDATED_TIPO_DE_ARMAZENAMENTO);
        assertThat(testArmazenamento.getEndereco()).isEqualTo(UPDATED_ENDERECO);
    }

    @Test
    @Transactional
    void putNonExistingArmazenamento() throws Exception {
        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();
        armazenamento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArmazenamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, armazenamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(armazenamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchArmazenamento() throws Exception {
        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();
        armazenamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArmazenamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(armazenamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamArmazenamento() throws Exception {
        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();
        armazenamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArmazenamentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(armazenamento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateArmazenamentoWithPatch() throws Exception {
        // Initialize the database
        armazenamentoRepository.saveAndFlush(armazenamento);

        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();

        // Update the armazenamento using partial update
        Armazenamento partialUpdatedArmazenamento = new Armazenamento();
        partialUpdatedArmazenamento.setId(armazenamento.getId());

        restArmazenamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArmazenamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArmazenamento))
            )
            .andExpect(status().isOk());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
        Armazenamento testArmazenamento = armazenamentoList.get(armazenamentoList.size() - 1);
        assertThat(testArmazenamento.getLocal()).isEqualTo(DEFAULT_LOCAL);
        assertThat(testArmazenamento.getTipoDeArmazenamento()).isEqualTo(DEFAULT_TIPO_DE_ARMAZENAMENTO);
        assertThat(testArmazenamento.getEndereco()).isEqualTo(DEFAULT_ENDERECO);
    }

    @Test
    @Transactional
    void fullUpdateArmazenamentoWithPatch() throws Exception {
        // Initialize the database
        armazenamentoRepository.saveAndFlush(armazenamento);

        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();

        // Update the armazenamento using partial update
        Armazenamento partialUpdatedArmazenamento = new Armazenamento();
        partialUpdatedArmazenamento.setId(armazenamento.getId());

        partialUpdatedArmazenamento.local(UPDATED_LOCAL).tipoDeArmazenamento(UPDATED_TIPO_DE_ARMAZENAMENTO).endereco(UPDATED_ENDERECO);

        restArmazenamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArmazenamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArmazenamento))
            )
            .andExpect(status().isOk());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
        Armazenamento testArmazenamento = armazenamentoList.get(armazenamentoList.size() - 1);
        assertThat(testArmazenamento.getLocal()).isEqualTo(UPDATED_LOCAL);
        assertThat(testArmazenamento.getTipoDeArmazenamento()).isEqualTo(UPDATED_TIPO_DE_ARMAZENAMENTO);
        assertThat(testArmazenamento.getEndereco()).isEqualTo(UPDATED_ENDERECO);
    }

    @Test
    @Transactional
    void patchNonExistingArmazenamento() throws Exception {
        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();
        armazenamento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArmazenamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, armazenamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(armazenamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchArmazenamento() throws Exception {
        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();
        armazenamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArmazenamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(armazenamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamArmazenamento() throws Exception {
        int databaseSizeBeforeUpdate = armazenamentoRepository.findAll().size();
        armazenamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArmazenamentoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(armazenamento))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Armazenamento in the database
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteArmazenamento() throws Exception {
        // Initialize the database
        armazenamentoRepository.saveAndFlush(armazenamento);

        int databaseSizeBeforeDelete = armazenamentoRepository.findAll().size();

        // Delete the armazenamento
        restArmazenamentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, armazenamento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Armazenamento> armazenamentoList = armazenamentoRepository.findAll();
        assertThat(armazenamentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
