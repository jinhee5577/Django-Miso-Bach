from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'bach'

urlpatterns = [
    path('', views.bach, name='main'),
    path('main', views.bach_main, name='main'),
    path('bachSearch', views.bach_search, name='bachSearch'),
    path('bachVisium', views.bach_visium, name='bachVisium'),
    path('search_visium', views.search_visium, name='search_visium'),   
    path('draw_visium_chart', views.draw_visium_chart, name='draw_visium_chart'), 
    path('get_singleCellUmap', views.get_singleCellUmap, name='get_singleCellUmap'),  
    path('getUmapCellCounts', views.get_umap_cell_counts, name='get_umap_cell_counts'),  
    path('get_SelectedCellData', views.get_SelectedCellData, name='get_SelectedCellData'),   
    path('get_umapSelectedCellData', views.get_umapSelectedCellData, name='get_umapSelectedCellData'), 
    path('get_searchUmap', views.get_searchUmap, name='get_searchUmap'),  
    path('get_umapSelectedSearchData', views.get_umapSelectedSearchData, name='get_umapSelectedSearchData'),
    path('get_visiumSelectedSearchData', views.get_visiumSelectedSearchData, name='get_visiumSelectedSearchData'),
    
]
 