package br.ufpa.castanhal.es2.armazem.web.rest;

import br.ufpa.castanhal.es2.armazem.domain.Armazenamento;
import br.ufpa.castanhal.es2.armazem.repository.ArmazenamentoRepository;
import br.ufpa.castanhal.es2.armazem.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.ufpa.castanhal.es2.armazem.domain.Armazenamento}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ArmazenamentoResource {

    private final Logger log = LoggerFactory.getLogger(ArmazenamentoResource.class);

    private static final String ENTITY_NAME = "armazenamento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ArmazenamentoRepository armazenamentoRepository;

    public ArmazenamentoResource(ArmazenamentoRepository armazenamentoRepository) {
        this.armazenamentoRepository = armazenamentoRepository;
    }

    /**
     * {@code POST  /armazenamentos} : Create a new armazenamento.
     *
     * @param armazenamento the armazenamento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new armazenamento, or with status {@code 400 (Bad Request)} if the armazenamento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/armazenamentos")
    public ResponseEntity<Armazenamento> createArmazenamento(@RequestBody Armazenamento armazenamento) throws URISyntaxException {
        log.debug("REST request to save Armazenamento : {}", armazenamento);
        if (armazenamento.getId() != null) {
            throw new BadRequestAlertException("A new armazenamento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Armazenamento result = armazenamentoRepository.save(armazenamento);
        return ResponseEntity
            .created(new URI("/api/armazenamentos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /armazenamentos/:id} : Updates an existing armazenamento.
     *
     * @param id the id of the armazenamento to save.
     * @param armazenamento the armazenamento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated armazenamento,
     * or with status {@code 400 (Bad Request)} if the armazenamento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the armazenamento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/armazenamentos/{id}")
    public ResponseEntity<Armazenamento> updateArmazenamento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Armazenamento armazenamento
    ) throws URISyntaxException {
        log.debug("REST request to update Armazenamento : {}, {}", id, armazenamento);
        if (armazenamento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, armazenamento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!armazenamentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Armazenamento result = armazenamentoRepository.save(armazenamento);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, armazenamento.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /armazenamentos/:id} : Partial updates given fields of an existing armazenamento, field will ignore if it is null
     *
     * @param id the id of the armazenamento to save.
     * @param armazenamento the armazenamento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated armazenamento,
     * or with status {@code 400 (Bad Request)} if the armazenamento is not valid,
     * or with status {@code 404 (Not Found)} if the armazenamento is not found,
     * or with status {@code 500 (Internal Server Error)} if the armazenamento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/armazenamentos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Armazenamento> partialUpdateArmazenamento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Armazenamento armazenamento
    ) throws URISyntaxException {
        log.debug("REST request to partial update Armazenamento partially : {}, {}", id, armazenamento);
        if (armazenamento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, armazenamento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!armazenamentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Armazenamento> result = armazenamentoRepository
            .findById(armazenamento.getId())
            .map(existingArmazenamento -> {
                if (armazenamento.getLocal() != null) {
                    existingArmazenamento.setLocal(armazenamento.getLocal());
                }
                if (armazenamento.getTipoDeArmazenamento() != null) {
                    existingArmazenamento.setTipoDeArmazenamento(armazenamento.getTipoDeArmazenamento());
                }
                if (armazenamento.getEndereco() != null) {
                    existingArmazenamento.setEndereco(armazenamento.getEndereco());
                }

                return existingArmazenamento;
            })
            .map(armazenamentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, armazenamento.getId().toString())
        );
    }

    /**
     * {@code GET  /armazenamentos} : get all the armazenamentos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of armazenamentos in body.
     */
    @GetMapping("/armazenamentos")
    public List<Armazenamento> getAllArmazenamentos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Armazenamentos");
        if (eagerload) {
            return armazenamentoRepository.findAllWithEagerRelationships();
        } else {
            return armazenamentoRepository.findAll();
        }
    }

    /**
     * {@code GET  /armazenamentos/:id} : get the "id" armazenamento.
     *
     * @param id the id of the armazenamento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the armazenamento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/armazenamentos/{id}")
    public ResponseEntity<Armazenamento> getArmazenamento(@PathVariable Long id) {
        log.debug("REST request to get Armazenamento : {}", id);
        Optional<Armazenamento> armazenamento = armazenamentoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(armazenamento);
    }

    /**
     * {@code DELETE  /armazenamentos/:id} : delete the "id" armazenamento.
     *
     * @param id the id of the armazenamento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/armazenamentos/{id}")
    public ResponseEntity<Void> deleteArmazenamento(@PathVariable Long id) {
        log.debug("REST request to delete Armazenamento : {}", id);
        armazenamentoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
