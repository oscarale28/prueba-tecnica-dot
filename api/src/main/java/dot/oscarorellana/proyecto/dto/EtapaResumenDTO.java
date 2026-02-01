package dot.oscarorellana.proyecto.dto;

public class EtapaResumenDTO {

    private Long totalEtapas;
    private Long totalEtapasCompletadas;
    private EtapaSimpleDTO etapaActiva;

    public EtapaResumenDTO() {
    }

    public EtapaResumenDTO(Long totalEtapas, Long totalEtapasCompletadas, EtapaSimpleDTO etapaActiva) {
        this.totalEtapas = totalEtapas;
        this.totalEtapasCompletadas = totalEtapasCompletadas;
        this.etapaActiva = etapaActiva;
    }

    public Long getTotalEtapas() {
        return totalEtapas;
    }

    public void setTotalEtapas(Long totalEtapas) {
        this.totalEtapas = totalEtapas;
    }

    public Long getTotalEtapasCompletadas() {
        return totalEtapasCompletadas;
    }

    public void setTotalEtapasCompletadas(Long totalEtapasCompletadas) {
        this.totalEtapasCompletadas = totalEtapasCompletadas;
    }

    public EtapaSimpleDTO getEtapaActiva() {
        return etapaActiva;
    }

    public void setEtapaActiva(EtapaSimpleDTO etapaActiva) {
        this.etapaActiva = etapaActiva;
    }
}
