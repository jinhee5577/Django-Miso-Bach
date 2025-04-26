from itertools import combinations_with_replacement
from multiprocessing import context
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

from django.core.serializers import serialize
from django.db.models import Count
from django.db.models import OuterRef, Subquery, F, Q, FloatField
from django.db.models.functions import Cast, Coalesce
from django.conf import settings
from django.db import connection

from web_bach.models import MetaCoordiInfo, VisiumExprssionInfo, SingleCellUmapInfo, VisiumUmapInfo
import json

_bach_dir = settings.BACH_DIR[settings.BACH_ENV]

#aive 메인화면을 표시한다.
def bach(request):
    return render(request, 'bach/bach_main.html', {})

#aive 메인화면을 표시한다.
def bach_main(request):
    return render(request, 'bach/bach_main.html', {})

# BRL_Singlecell페이지
def bach_search(request):
    return render(request, 'bach/bach_single_cell.html', {}) 

# BRL_VISIUM 페이지
def bach_visium(request):
    return render(request, 'bach/bach_search.html', {})

# BRL_SEARCH 페이지
# def bach_search(request):
#     # 모든 데이터 가져오기
#     singleCellUmapAll_data = SingleCellUmapInfo.objects.all().values("single_cell_bar_code","fine_celltype","main_celltype","umap_1","umap_2","smpl_info_seq_id")

#     SingleCellUmapList = list(singleCellUmapAll_data)
#     print('데이터체크 =', SingleCellUmapList)
    
#     # 데이터를 템플릿에 전달
#     return render(request, 'bach/bach_search.html', {'SingleCellUmapList' : SingleCellUmapList})  


####################### SingleCell Page API ###############################

# SingleCellUmap 데이터 전체 가져오는 api 따로만듬.
def get_singleCellUmap(request):
    # 모든 데이터 가져오기
    singleCellUmapAll_data = SingleCellUmapInfo.objects.all().values("single_cell_bar_code","fine_celltype","main_celltype","umap_1","umap_2","smpl_info_seq")

    # 그룹화된 fine_celltype,main_celltype 데이터 가져오는 쿼리
    fine_celltype = SingleCellUmapInfo.objects.values("fine_celltype").distinct()  # .distinct(): 중복 제거를 수행함.
    main_celltype = SingleCellUmapInfo.objects.values("main_celltype").distinct()  # .distinct(): 중복 제거를 수행함.
   # print('cell type', fine_celltype)
    
    # 데이터를 템플릿에 전달
    singleCellUmap_celltTypeList = {
        'singleCellUmapList' : list(singleCellUmapAll_data),
        'fine_celltype' : list(fine_celltype),
        'main_celltype' : list(main_celltype)
    }

    return JsonResponse(singleCellUmap_celltTypeList, safe=False)


# SingleCell Plots차트 만들기위한 데이터가져와서 가공하는 api
def get_umap_cell_counts(request):
    # 모든 데이터 가져오기
    fineCountsList = []
    mainCountsList = []

    # fine_celltype, main_celltype 두가지 그룹화한 갯수 결과 가져옴.
    for i in range(1, 20):
        fine_dict = {}
        main_dict = {}
       # values('fine_celltype'): GROUP BY fine_celltype와 동일한 효과를 냅니다.
       # annotate(count=Count('fine_celltype')): COUNT(*)를 계산합니다.fine_celltype
        fineResult = SingleCellUmapInfo.objects.filter(smpl_info_seq=i).values("fine_celltype").annotate(count=Count('fine_celltype'))
        mainResult = SingleCellUmapInfo.objects.filter(smpl_info_seq=i).values("main_celltype").annotate(count=Count('main_celltype'))

        for item in fineResult: # result는 쿼리셋의 딕셔너리 목록
            # 딕셔너리에 추가
            fine_dict[item['fine_celltype']] = item['count']            
        # 리스트에 추가
        fineCountsList.append(fine_dict)
       # print(new_dict)

        for item in mainResult: # result는 쿼리셋의 딕셔너리 목록
            # 딕셔너리에 추가
            main_dict[item['main_celltype']] = item['count']            
        # 리스트에 추가
        mainCountsList.append(main_dict)
       # print(main_dict)
    
    # 데이터를 템플릿에 전달
    CellCountsList_json = {'fineCountsList': fineCountsList, 'mainCountsList': mainCountsList}

    return JsonResponse(CellCountsList_json, safe=False)


#선택한 checkCell들로만 Plots차트그려주기 위한 data가져온후 DBdata 전송API.
def get_SelectedCellData(request):
    if request.method == 'POST':
         # request.body에 프론트에서 보낸 데이터가 들어있음.
        data = json.loads(request.body) # {'search': 'LINC01409'} 이렇게 나옴
        choosedCells = data.get('choosedCells','')
        cellTypeNum = int(data.get('cellTypeNum',''))
        # print('cells=', choosedCells) # ['CD4+ Tfh', 'CD4+ Tm', 'CD4+ Tn', 'Follicular B', 'GC B'] 이런식으로 도착함.
        
        # 선택한 cell로 만들어진 각환자별 data가 담길 List
        choosed_CellCountsList = []
        for i in range(1,20):
            fine_dict = {}
            main_dict = {}

            if cellTypeNum == 1: # fine_celltype일 경우
                selectFineCellResult = SingleCellUmapInfo.objects.filter(fine_celltype__in=choosedCells, smpl_info_seq=i).values("fine_celltype").annotate(count=Count('fine_celltype'))
               # print('확인용=', list(selectFineCellResult))
                
                for obj in selectFineCellResult: # selectFineCellResult는 쿼리셋의 딕셔너리 목록
                    fine_dict[obj['fine_celltype']] = obj['count']
                # 리스트에 추가    
                choosed_CellCountsList.append(fine_dict)
            else : # main_celltype일 경우
                selectMainCellResult = SingleCellUmapInfo.objects.filter(main_celltype__in=choosedCells, smpl_info_seq=i).values("main_celltype").annotate(count=Count('main_celltype'))
              #  print('확인용=', list(selectMainCellResult))
                
                for obj in selectMainCellResult: # selectMainCellResult 쿼리셋의 딕셔너리 목록
                    main_dict[obj['main_celltype']] = obj['count']
                # 리스트에 추가    
                choosed_CellCountsList.append(main_dict)

        # json.dumps()는 Python 객체를 JSON 문자열로 변환하는 데 사용함. Django에서 JSON 데이터를 직접 다룰 때 주로 사용되며
        # JsonResponse()는  자동으로 JSON 변환 후 응답. 더 간단하게는 JsonResponse를 사용하는 것이 권장됨.
        choosedCellsData_json = {'choosedCellsData' : choosed_CellCountsList}

    return JsonResponse(choosedCellsData_json, safe=False)


#선택한 checkCell들로만 UMAP차트그려주기 위한 data가져온후 DBdata 전송API.
def get_umapSelectedCellData(request):
    if request.method == 'POST':
         # request.body에 프론트에서 보낸 데이터가 들어있음.
        data = json.loads(request.body) # {'search': 'LINC01409'} 이렇게 나옴
        choosedCells = data.get('choosedCells','')
        cellTypeNum = int(data.get('cellTypeNum',''))
       # print('cells=', choosedCells) # ['CD4+ Tfh', 'CD4+ Tm', 'CD4+ Tn', 'Follicular B', 'GC B'] 이런식으로 도착함.
     
        selectCellUmapResult = []
        if cellTypeNum == 1: # fine_celltype일 경우
            selectCellUmapResult = SingleCellUmapInfo.objects.filter(fine_celltype__in=choosedCells).values("single_cell_bar_code", "fine_celltype", "umap_1", "umap_2", "smpl_info_seq")
        else : # main_celltype일 경우
            selectCellUmapResult = SingleCellUmapInfo.objects.filter(main_celltype__in=choosedCells).values("single_cell_bar_code", "main_celltype", "umap_1", "umap_2", "smpl_info_seq")
            print('확인용=', list(selectCellUmapResult))

        choosedCellsData_json = {'choosedCellsData' : list(selectCellUmapResult)}
    return JsonResponse(choosedCellsData_json, safe=False)



####################### Search Page API ###############################

# Search Page UmapChart 데이터 전체 가져오는 api
def get_searchUmap(request):
    # 모든 데이터 가져오기
    searchUmapAll_data = VisiumUmapInfo.objects.all().values("visium_region","umap_1","umap_2","smpl_info_seq")

    # 그룹화된 fine_celltype,main_celltype 데이터 가져오는 쿼리
    regionType = VisiumUmapInfo.objects.values("visium_region").distinct()  # .distinct(): 중복 제거를 수행함.
    print('cell type', list(regionType))
    
    # 데이터를 템플릿에 전달
    searchUmap_DataJson = {
        'searchUmapList' : list(searchUmapAll_data),
        'regionType' : list(regionType)
    }

    return JsonResponse(searchUmap_DataJson, safe=False)


# 선택한 checkCell들로만 Search UMAP차트 그려주기 위한 DBdata 전송API.
def get_umapSelectedSearchData(request):
    if request.method == 'POST':
        # request.body에 프론트에서 보낸 데이터가 들어있음.
        data = json.loads(request.body) # {'search': 'LINC01409'} 이렇게 나옴
        choosedCells = data.get('choosedCells','')
       # print('cells=', choosedCells) # ['CD4+ Tfh', 'CD4+ Tm', 'CD4+ Tn', 'Follicular B', 'GC B'] 이런식으로 도착함.     
        
        selectCellUmapResult = VisiumUmapInfo.objects.filter(visium_region__in=choosedCells).values("visium_region","umap_1", "umap_2", "smpl_info_seq")       
        print('확인용=', list(selectCellUmapResult))

        choosedCellsData_json = {'choosedCellsData' : list(selectCellUmapResult)}
        return JsonResponse(choosedCellsData_json, safe=False)


#Search 페이지 검색 결과를 조회함.
def search_visium(request):
    if request.method == 'POST':
        # search = request.POST.get('search') # 프론트엔드에서 Ajax로 보내서 이거 안됨.
        # request.body에 프론트에서 보낸 데이터가 들어있음.
        data = json.loads(request.body) # {'search': 'LINC01409'} 이렇게 나옴
        searchData = data.get('search','')

        # 방법 3).
        # VisiumExprssionInfo에서 조건에 맞는 bar_code를 필터링
        visium_subquery = VisiumExprssionInfo.objects.filter(
            smpl_info_seq=OuterRef('smpl_info_seq'),
            bar_code=OuterRef('bar_code'),
            gene_nm__iexact = searchData  # __iexact는 대소문자 구분 없이 정확히 일치하는 값을 찾는다.
        ).values('smpl_info_seq')[:1]

        # MetacoordiInfo에서 Subquery로 필터링
        searchResult = MetaCoordiInfo.objects.annotate(
            matched_smpl_info_seq = Subquery(visium_subquery)
        ).filter(
            matched_smpl_info_seq__isnull=False
        ).values(
            'umap_clustr_no',
            'smpl_info_seq',
            'tissue_no',
            'intgrt_clustr_rgin',
            'visium_spatial_gene_cnt',
        )
    
        # gene_nm 추가해줌.
        for obj in searchResult:
             obj['gene_nm'] = searchData.upper()
        # OR조건으로 SELECT해올때 쓰는 문법
        # searchResult = VisiumExprssionInfo.objects.filter(Q(gene_nm = searchData)).values()[:20]  # 20개만 가져옴 인덱싱
        # json.dumps()는 Python 객체를 JSON 문자열로 변환하는 데 사용함. Django에서 JSON 데이터를 직접 다룰 때 주로 사용되며
        # JsonResponse()는  자동으로 JSON 변환 후 응답. 더 간단하게는 JsonResponse를 사용하는 것이 권장됨.
        search_json = {'searchResult' : list(searchResult)}
    
        return JsonResponse(search_json, safe=False)
    return JsonResponse({"error": "Invalid request method"}, status=400)


#선택한 Visium 차트그리기위한 api.
def draw_visium_chart(request):
    smpid = request.GET.get('smpid') 
    gene_name = request.GET.get('gene')

    # OR조건으로 SELECT해올때 쓰는 문법
    # Django ORM에서 가져온 컬럼명에 별칭(alias)을 붙이려면 annotate()를 사용해야함.
    # F()객체: 원래 모델 필드를 참조하는데 사용됨.

    # 방법 3) express_val 값이 필요함. 서브쿼리를 사용하여 express_val을 가져오기 null 값 보임. (이방법으로 하면 outer join한 효과가 나타남.)
    subquery = VisiumExprssionInfo.objects.filter(
        smpl_info_seq = OuterRef('smpl_info_seq'),
        bar_code = OuterRef('bar_code'),
        gene_nm__iexact = gene_name,
        express_val__isnull=False  # IS NOT NULL 추가
    ).exclude(express_val = None).values('express_val')[:1]  # IS NOT NULL 적용, 하나의 값만 가져오기

    # 메인 쿼리
    coordinateData = MetaCoordiInfo.objects.annotate(
        express_val = Cast(Subquery(subquery), FloatField())  # 여기에 output_field 올바르게 전달
    ).filter(
        smpl_info_seq = smpid,
    ).values(y=F("row_lc"), x=F("col_lc"), value=F("express_val"))  # 필드 별칭 설정

    # 각 smpl_id별 그룹화된 intgrt_clustr_rgin 데이터 가져오는 쿼리.  
    regionType = MetaCoordiInfo.objects.filter(Q(smpl_info_seq = int(smpid))).values("intgrt_clustr_rgin").distinct()  # .distinct(): 중복 제거를 수행함.

    # 각 smpl_id별 그룹화된 each_smpl_rgin 데이터 가져오는 쿼리.  
    Each_region = MetaCoordiInfo.objects.filter(Q(smpl_info_seq = int(smpid))).values("each_smpl_rgin").distinct()  # .distinct(): 중복 제거를 수행함.
    
    # json.dumps()는 Python 객체를 JSON 문자열로 변환하는 데 사용함. Django에서 JSON 데이터를 직접 다룰 때 주로 사용되며
    # JsonResponse()는 자동으로 JSON 변환 후 응답. 더 간단하게는 JsonResponse를 사용하는 것이 권장됨.
    coordinateData_json = {
        'coordinateData' : list(coordinateData),
        'regionType' : list(regionType),
        'Each_region' : list(Each_region)
    }

    return JsonResponse(coordinateData_json, safe=False)


# 선택한 checkRegion들로만 Search Visium차트 그려주기 위한 DBdata 전송API.
def get_visiumSelectedSearchData(request):
    if request.method == 'POST':
        # request.body에 프론트에서 보낸 데이터가 들어있음.
        data = json.loads(request.body) # {'search': 'LINC01409'} 이렇게 나옴
        choosedRegion = data.get('choosedRegion','')
        gene_name = data.get('gene_name','')
        smplId = int(data.get('smplId',''))
        regionTypeNum = int(data.get('regionTypeNum',''))
       # print('cells=', choosedRegion) # ['CD4+ Tfh', 'CD4+ Tm', 'CD4+ Tn', 'Follicular B', 'GC B'] 이런식으로 도착함.     
        
        selectRegionVisiumResult = []
        if regionTypeNum == 1 : # intgrt region type일 경우
            # 기존 코드
            # selectRegionVisiumResult = MetaCoordiInfo.objects.filter(intgrt_clustr_rgin__in=choosedRegion, smpl_info_seq=smplId).annotate(
            #     y = F("row_lc"),
            #     x = F("col_lc")
            # ).values("y","x")

            # 수정 코드
            subquery = VisiumExprssionInfo.objects.filter(
                smpl_info_seq = OuterRef('smpl_info_seq'),
                bar_code = OuterRef('bar_code'),
                gene_nm__iexact = gene_name,
                express_val__isnull=False  # IS NOT NULL 추가
            ).exclude(express_val = None).values('express_val')[:1]  # IS NOT NULL 적용, 하나의 값만 가져오기

            # 메인 쿼리
            selectRegionVisiumResult = MetaCoordiInfo.objects.annotate(
                express_val = Cast(Subquery(subquery), FloatField())  # 여기에 output_field 올바르게 전달
            ).filter(
                smpl_info_seq = smplId, intgrt_clustr_rgin__in = choosedRegion
            ).values(y=F("row_lc"), x=F("col_lc"), value=F("express_val"))  # 필드 별칭 설정        
        else : # each region type일 경우
            subquery = VisiumExprssionInfo.objects.filter(
                smpl_info_seq = OuterRef('smpl_info_seq'),
                bar_code = OuterRef('bar_code'),
                gene_nm__iexact = gene_name,
                express_val__isnull=False  # IS NOT NULL 추가
            ).exclude(express_val = None).values('express_val')[:1]  # IS NOT NULL 적용, 하나의 값만 가져오기

            # 메인 쿼리
            selectRegionVisiumResult = MetaCoordiInfo.objects.annotate(
                express_val = Cast(Subquery(subquery), FloatField())  # 여기에 output_field 올바르게 전달
            ).filter(
                smpl_info_seq = smplId, each_smpl_rgin__in = choosedRegion
            ).values(y=F("row_lc"), x=F("col_lc"), value=F("express_val"))  # 필드 별칭 설정

        choosedCellsData_json = {'choosedRegionData' : list(selectRegionVisiumResult)}
        return JsonResponse(choosedCellsData_json, safe=False)

