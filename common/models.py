from django.db import models

#공통코드
class CommCode(models.Model):
    cl_code = models.CharField(max_length=5)
    cl_code_nm = models.TextField()
    code = models.CharField(max_length=3)
    code_nm = models.TextField()
    code_dc = models.TextField(null=True)
    use_yn = models.CharField(max_length=1, default='Y')
    regist_id = models.TextField()
    regist_dt = models.DateTimeField()
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['cl_code','code'],
                name='COMM_CODE Unique',
            ),
        ]
    
    def __str__(self):
        return self.code_nm
    