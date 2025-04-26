from django.db import models

#샘플 정보
class SampleInfo(models.Model):
    smpl_info_seq = models.AutoField(primary_key=True)
    smpl_id = models.IntegerField(null=True)
    
    def __str__(self):
        return self.smpl_info_seq

# 메타, 좌표 결합 정보
class MetaCoordiInfo(models.Model):
    meta_coordi_info_seq = models.AutoField(primary_key=True)
    smpl_info_seq  = models.IntegerField(null=False)
    bar_code = models.CharField(max_length=20)
    visium_spatial_rna_cnt = models.IntegerField(null=True)
    visium_spatial_gene_cnt = models.IntegerField(null=True)
    sct_spatial_umi_cnt = models.IntegerField(null=True)
    sct_spatial_gene_cnt = models.IntegerField(null=True)
    umap_clustr_no = models.IntegerField(null=True)
    each_smpl_rgin = models.CharField(max_length=20)
    intgrt_clustr_no = models.IntegerField(null=True)
    intgrt_clustr_rgin = models.CharField(max_length=20)
    tissue_no = models.IntegerField(null=True)
    row_lc = models.IntegerField(null=True)
    col_lc = models.IntegerField(null=True)
    img_row_lc = models.IntegerField(null=True)
    img_col_lc = models.IntegerField(null=True)
    smpl_info = models.ForeignKey(SampleInfo, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.smpl_info_id}|{self.bar_code}'
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['smpl_info_id', 'bar_code'],
                name='MetaCoordiInfo Unique IDX 1',
            ),
        ]

#비지움 발현정보
class VisiumExprssionInfo(models.Model):
    visium_exprss_Info_seq = models.AutoField(primary_key=True)
    """Model에서 FK는 하나의 컬럼만 설정할 수 있어
    MetaCoordiInfo와 관계된 FK컬럼은 임의로 정의해서 사용
    """
    smpl_info_seq  = models.IntegerField(null=False)
    bar_code = models.CharField(max_length=20)
    gene_nm = models.CharField(max_length=20)
    express_val = models.IntegerField(null=True)
    
    def __str__(self):
        return f'{self.smpl_info_id}|{self.bar_code}|{self.gene_nm}'
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['smpl_info_seq', 'bar_code', 'gene_nm'],
                name='VisiumExprssionInfo Unique IDX 1',
            ),
        ]

# SingleCell UMAP 결합정보
class SingleCellUmapInfo(models.Model):
    single_cell_umap_info_seq = models.AutoField(primary_key=True)
    smpl_info_seq  = models.IntegerField(null=False)
    single_cell_bar_code = models.CharField(max_length=60)
    clustrs_no = models.IntegerField(null=True)
    fine_celltype = models.CharField(max_length=30)
    main_celltype = models.CharField(max_length=30)   
    umap_1 = models.DecimalField(max_digits=10, decimal_places=7)
    umap_2 = models.DecimalField(max_digits=10, decimal_places=7)
    smpl_info = models.ForeignKey(SampleInfo, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.single_cell_umap_info_seq
    
# Visium UMAP 결합정보
class VisiumUmapInfo(models.Model):
    visium_umap_info_seq = models.AutoField(primary_key=True)
    smpl_info_seq  = models.IntegerField(null=False)
    visium_bar_code = models.CharField(max_length=60)
    visium_clustrs_no = models.IntegerField(null=True)
    visium_region = models.CharField(max_length=30) 
    umap_1 = models.DecimalField(max_digits=10, decimal_places=7)
    umap_2 = models.DecimalField(max_digits=10, decimal_places=7)
    smpl_info = models.ForeignKey(SampleInfo, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.visium_umap_info_seq
    